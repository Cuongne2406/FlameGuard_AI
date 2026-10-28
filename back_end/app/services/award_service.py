from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc, or_, and_
from typing import List, Optional, Dict, Any
from uuid import UUID
import uuid
from datetime import date, datetime, timezone
from fastapi import HTTPException

from app.models.awards import (
    Award, AwardApplication, AwardStatus, AwardCriteria, CriteriaType,
    AwardPeriod, AwardStandard, AwardApplicationItem, AwardApprovalHistory,
    AwardPeriodStatus, StandardRuleType, TargetType
)
from app.models.core import Organization, OrgType, AcademicTerm, User, UserOrganization
from app.models.events import EventRegistration, EventRegistrationStatus
from app.schemas.award_schemas import (
    AwardCreate, AwardUpdate,
    AwardPeriodCreate, AwardPeriodUpdate,
    AwardStandardCreate, AwardStandardUpdate,
    AwardApplicationCreate, AwardApplicationUpdate,
    AwardEvaluateRequest, AwardConcludeRequest, AwardDecisionRequest, AwardFeedbackRequest
)
from app.services.notification_service import create_notification
from app.schemas.notification_schemas import NotificationCreate

# ==========================================
# Legacy Engine & Compatibility Helpers
# ==========================================

def check_award_eligibility(db: Session, user_id: UUID):
    """
    Checking Engine: So khớp thành tích thực tế của User với bộ tiêu chí của Admin.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"passed": False, "error": "User not found"}

    criteria_list = db.query(AwardCriteria).all()
    results = []
    overall_passed = True

    for criteria in criteria_list:
        passed = False
        actual_val = "N/A"
        
        if criteria.type == CriteriaType.MIN_TRAINING_SCORE:
            actual_val = user.training_score or 0
            passed = float(actual_val) >= float(criteria.value)
        elif criteria.type == CriteriaType.MIN_GPA:
            actual_val = 3.5 
            passed = float(actual_val) >= float(criteria.value)
        elif criteria.type == CriteriaType.MIN_EVENTS_ATTENDED:
            actual_val = db.query(EventRegistration).filter(
                EventRegistration.user_id == user_id,
                EventRegistration.status == EventRegistrationStatus.ATTENDED
            ).count()
            passed = int(actual_val) >= int(criteria.value)

        results.append({
            "criteria_name": criteria.name,
            "required": criteria.value,
            "actual": str(actual_val),
            "passed": passed,
            "is_required": criteria.is_required
        })
        
        if criteria.is_required and not passed:
            overall_passed = False

    return {
        "overall_passed": overall_passed,
        "details": results
    }

def create_award_application(db: Session, award_in: AwardCreate):
    """
    Tạo đơn nộp thưởng legacy kèm Sơ lọc.
    """
    screening = check_award_eligibility(db, award_in.user_id) if award_in.user_id else None
    obj_data = award_in.model_dump(exclude={"screening_results", "comments"}, exclude_unset=True)
    db_obj = Award(**obj_data, screening_results=screening)
    if not db_obj.application_code:
        year = date.today().year
        db_obj.application_code = generate_application_code(db, year)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)

    if db_obj.user_id:
        try:
            notif_in = NotificationCreate(
                user_id=db_obj.user_id,
                title="Đã lưu Hồ sơ Xét duyệt",
                message=f"Hồ sơ '{db_obj.award_name}' của bạn đã được ghi nhận."
            )
            create_notification(db, notif_in)
        except Exception as e:
            print(f"Error sending notification: {e}")

    return db_obj

def get_awards_list(db: Session, skip: int = 0, limit: int = 100):
    """
    Lấy danh sách bằng khen kèm thông tin User và Lớp.
    """
    awards = db.query(Award).options(
        joinedload(Award.user).joinedload(User.organizations).joinedload(UserOrganization.organization)
    ).order_by(Award.created_at.desc()).offset(skip).limit(limit).all()
    
    for award in awards:
        if award.user:
            award.full_name = award.full_name or award.user.full_name
            award.student_id = award.student_code or award.user.student_id
            primary_org = next((uo.organization for uo in award.user.organizations if uo.is_primary), None)
            if not primary_org and award.user.organizations:
                primary_org = award.user.organizations[0].organization
            if primary_org:
                award.university = primary_org.name
        else:
            award.student_id = award.student_code
    return awards

def update_award_assessment(db: Session, award_id: UUID, award_in: AwardUpdate):
    """
    Cập nhật đánh giá cho bằng khen (legacy).
    """
    db_obj = db.query(Award).filter(Award.id == award_id).first()
    if not db_obj:
        return None
    
    update_data = award_in.model_dump(exclude_unset=True)
    comments = update_data.pop("comments", None)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    if not db_obj.status or db_obj.status in ["PENDING", "DRAFT"]:
        db_obj.status = "APPROVED"
        
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)

    if db_obj.user_id:
        try:
            status_str = "ĐƯỢC DUYỆT" if db_obj.status == "APPROVED" else "BỊ TỪ CHỐI"
            notif_msg = f"Hồ sơ '{db_obj.award_name}' của bạn đã {status_str}."
            if comments:
                notif_msg += f" Kèm lời nhắn: {comments}"
            notif_in = NotificationCreate(
                user_id=db_obj.user_id,
                title=f"Kết quả Xét chọn: {status_str}",
                message=notif_msg
            )
            create_notification(db, notif_in)
        except Exception as e:
            print(f"Error sending notification: {e}")

    return db_obj

def get_award_stats(db: Session, timescale: str = "Tháng này"):
    current_term = db.query(AcademicTerm).filter(AcademicTerm.is_current == True).first()
    remaining_days = "N/A"
    if current_term and current_term.end_date:
        delta = current_term.end_date - date.today()
        remaining_days = str(max(0, delta.days))

    total_submitted = db.query(Award).count()
    total_approved = db.query(Award).filter(Award.status == "APPROVED").count()
    pass_rate = "0%"
    if total_submitted > 0:
        pass_rate = f"{int((total_approved / total_submitted) * 100)}%"

    rankings_query = db.query(Organization).filter(Organization.type == OrgType.CLASS).order_by(desc(Organization.activity_points)).limit(10).all()
    rankings = []
    for i, org in enumerate(rankings_query):
        rankings.append({
            "rank": i + 1,
            "icon": "🥇" if i == 0 else "🥈" if i == 1 else "🥉" if i == 2 else "🎖️",
            "class": org.name,
            "university": org.name,
            "dept": "Khoa CNTT",
            "score": org.activity_points,
            "trend": "Ổn định",
            "trendColor": "slate",
            "tags": [f"Đoàn phí {int(org.fee_percentage)}%"] if org.fee_percentage > 0 else []
        })

    warning_org = db.query(Organization).filter(Organization.type == OrgType.CLASS).order_by(Organization.activity_points.asc()).first()
    warning_class = None
    if warning_org:
        warning_class = {
            "rank": db.query(Organization).filter(Organization.type == OrgType.CLASS, Organization.activity_points > warning_org.activity_points).count() + 1,
            "class": warning_org.name,
            "university": warning_org.name,
            "dept": "Khoa CNTT",
            "score": warning_org.activity_points,
            "trend": "Cần lưu ý",
            "note": warning_org.warning_message or "Điểm hoạt động thấp"
        }

    return {
        "summary": {
            "remainingDays": remaining_days,
            "submitted": str(total_submitted),
            "approved": str(total_approved),
            "passRate": pass_rate
        },
        "stats": [
            {
                "label": "TỔNG HỒ SƠ",
                "title": "Khen thưởng",
                "val": f"{total_submitted} hồ sơ",
                "icon": "folder_shared",
                "color": "blue",
                "progress": int((total_approved / total_submitted * 100)) if total_submitted > 0 else 0,
                "action": "Đang xử lý"
            },
            {
                "label": "HOÀN THÀNH",
                "title": "Đã xét duyệt",
                "val": f"{total_approved} hồ sơ",
                "icon": "verified",
                "color": "orange",
                "trend": f"Tỉ lệ duyệt {pass_rate}"
            },
            {
                "label": "CẢNH BÁO",
                "title": "Chậm tiến độ",
                "val": f"{db.query(Organization).filter(Organization.warning_message != None).count()} chi đoàn",
                "icon": "warning",
                "color": "rose",
                "alert": "Cần nhắc nhở ngay"
            }
        ],
        "rankings": rankings,
        "warningClass": warning_class
    }

def get_full_leaderboard(db: Session):
    rankings_query = db.query(Organization).filter(Organization.type == OrgType.CLASS).order_by(desc(Organization.activity_points)).all()
    rankings = []
    for i, org in enumerate(rankings_query):
        rankings.append({
            "rank": i + 1,
            "id": str(org.id),
            "class": org.name,
            "university": org.name,
            "dept": "Khoa CNTT",
            "score": org.activity_points,
            "trend": "Tăng hạng" if i % 2 == 0 else "Ổn định",
            "trendColor": "text-emerald-500" if i % 2 == 0 else "text-slate-400"
        })
    return rankings

# ==========================================
# SV5T Subsystem: Award Periods
# ==========================================

def get_periods(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    year: Optional[int] = None,
    keyword: Optional[str] = None
):
    query = db.query(AwardPeriod)
    if status and status != "ALL":
        query = query.filter(AwardPeriod.status == status)
    if year:
        query = query.filter(AwardPeriod.year == year)
    if keyword:
        kw = f"%{keyword.strip()}%"
        query = query.filter(or_(AwardPeriod.name.ilike(kw), AwardPeriod.code.ilike(kw)))
    
    periods = query.order_by(AwardPeriod.year.desc(), AwardPeriod.start_date.desc()).offset(skip).limit(limit).all()
    
    # Calculate counts
    res = []
    for p in periods:
        std_count = db.query(func.count(AwardStandard.id)).filter(AwardStandard.period_id == p.id).scalar() or 0
        app_count = db.query(func.count(Award.id)).filter(Award.period_id == p.id).scalar() or 0
        p_dict = {
            "id": p.id,
            "code": p.code,
            "name": p.name,
            "year": p.year,
            "description": p.description,
            "start_date": p.start_date,
            "end_date": p.end_date,
            "submission_deadline": p.submission_deadline,
            "decision_file_url": p.decision_file_url,
            "quotas": p.quotas,
            "status": p.status,
            "standards_count": std_count,
            "applications_count": app_count,
            "created_at": p.created_at
        }
        res.append(p_dict)
    return res

def get_period_by_id(db: Session, period_id: UUID):
    period = db.query(AwardPeriod).filter(AwardPeriod.id == period_id).first()
    if not period:
        raise HTTPException(status_code=404, detail="Không tìm thấy đợt khen thưởng")
    std_count = db.query(func.count(AwardStandard.id)).filter(AwardStandard.period_id == period.id).scalar() or 0
    app_count = db.query(func.count(Award.id)).filter(Award.period_id == period.id).scalar() or 0
    return {
        "id": period.id,
        "code": period.code,
        "name": period.name,
        "year": period.year,
        "description": period.description,
        "start_date": period.start_date,
        "end_date": period.end_date,
        "submission_deadline": period.submission_deadline,
        "decision_file_url": period.decision_file_url,
        "quotas": period.quotas,
        "status": period.status,
        "standards_count": std_count,
        "applications_count": app_count,
        "created_at": period.created_at
    }

def create_period(db: Session, period_in: AwardPeriodCreate, current_user: Optional[User] = None):
    # Verify code uniqueness
    existing = db.query(AwardPeriod).filter(AwardPeriod.code == period_in.code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Mã đợt '{period_in.code}' đã tồn tại")
    
    db_period = AwardPeriod(**period_in.model_dump())
    db.add(db_period)
    db.commit()
    db.refresh(db_period)
    return get_period_by_id(db, db_period.id)

def update_period(db: Session, period_id: UUID, period_in: AwardPeriodUpdate, current_user: Optional[User] = None):
    db_period = db.query(AwardPeriod).filter(AwardPeriod.id == period_id).first()
    if not db_period:
        raise HTTPException(status_code=404, detail="Không tìm thấy đợt khen thưởng")
    
    update_data = period_in.model_dump(exclude_unset=True)
    if "code" in update_data and update_data["code"] != db_period.code:
        existing = db.query(AwardPeriod).filter(AwardPeriod.code == update_data["code"]).first()
        if existing:
            raise HTTPException(status_code=400, detail=f"Mã đợt '{update_data['code']}' đã tồn tại")
            
    for field, val in update_data.items():
        setattr(db_period, field, val)
    db.commit()
    db.refresh(db_period)
    return get_period_by_id(db, db_period.id)

def delete_period(db: Session, period_id: UUID, current_user: Optional[User] = None):
    db_period = db.query(AwardPeriod).filter(AwardPeriod.id == period_id).first()
    if not db_period:
        raise HTTPException(status_code=404, detail="Không tìm thấy đợt khen thưởng")
    
    # Check if applications exist
    app_count = db.query(func.count(Award.id)).filter(Award.period_id == period_id).scalar() or 0
    if app_count > 0:
        raise HTTPException(status_code=400, detail="Không thể xóa đợt khen thưởng đã có hồ sơ nộp")
        
    db.delete(db_period)
    db.commit()
    return {"message": "Đã xóa đợt khen thưởng thành công"}

# ==========================================
# SV5T Subsystem: Award Standards
# ==========================================

def get_standards_by_period(db: Session, period_id: UUID):
    standards = db.query(AwardStandard).filter(
        AwardStandard.period_id == period_id
    ).order_by(AwardStandard.criteria_name.asc(), AwardStandard.order_num.asc()).all()
    return standards

def create_standard(db: Session, standard_in: AwardStandardCreate, current_user: Optional[User] = None):
    db_std = AwardStandard(**standard_in.model_dump())
    db.add(db_std)
    db.commit()
    db.refresh(db_std)
    return db_std

def update_standard(db: Session, standard_id: UUID, standard_in: AwardStandardUpdate, current_user: Optional[User] = None):
    db_std = db.query(AwardStandard).filter(AwardStandard.id == standard_id).first()
    if not db_std:
        raise HTTPException(status_code=404, detail="Không tìm thấy tiêu chuẩn")
    for field, val in standard_in.model_dump(exclude_unset=True).items():
        setattr(db_std, field, val)
    db.commit()
    db.refresh(db_std)
    return db_std

def delete_standard(db: Session, standard_id: UUID, current_user: Optional[User] = None):
    db_std = db.query(AwardStandard).filter(AwardStandard.id == standard_id).first()
    if not db_std:
        raise HTTPException(status_code=404, detail="Không tìm thấy tiêu chuẩn")
    db.delete(db_std)
    db.commit()
    return {"message": "Đã xóa tiêu chuẩn thành công"}

# ==========================================
# SV5T Subsystem: Role & Helper Functions
# ==========================================

def get_user_sv5t_role(user: User) -> str:
    """
    Map current user to one of SV5T roles:
    - 'ADMIN' (Quản trị viên toàn hệ thống / Ban Thường vụ Đoàn Trường / UNIVERSITY_ADMIN)
    - 'PROVINCE' (Ban Thường vụ Đoàn Trường / Thẩm định cấp Trường)
    - 'LEADER' (Chủ tịch Hội đồng Khen thưởng Cấp Trường)
    - 'SCHOOL' (Ban Chấp hành Đoàn Khoa / FACULTY_ADMIN / Cán bộ Khoa)
    - 'STUDENT' (Sinh viên / Đoàn viên Chi đoàn)
    """
    if not user:
        return "STUDENT"
    role_names = [r.name.upper() for r in user.roles] if hasattr(user, 'roles') and user.roles else []
    
    if "UNIVERSITY_ADMIN" in role_names or "ADMIN" in role_names or "SUPERADMIN" in role_names:
        return "ADMIN"
    if "LEADER" in role_names or "CHUTICH" in role_names or "COUNCIL_LEADER" in role_names:
        return "LEADER"
    if "PROVINCE" in role_names or "THANHPHO" in role_names or "CITY_ADMIN" in role_names:
        return "PROVINCE"
    if "FACULTY_ADMIN" in role_names or "SCHOOL" in role_names or "SUB_ADMIN" in role_names:
        return "SCHOOL"
    return "STUDENT"

def generate_application_code(db: Session, year: int) -> str:
    """
    Generate automatic application code formatted as HS-{year}-{001}
    """
    prefix = f"HS-{year}-"
    latest = db.query(Award.application_code).filter(
        Award.application_code.like(f"{prefix}%")
    ).order_by(desc(Award.application_code)).first()
    
    if latest and latest[0]:
        try:
            num_part = int(latest[0].replace(prefix, ""))
            next_num = num_part + 1
        except Exception:
            next_num = 1
    else:
        next_num = 1
        
    return f"{prefix}{next_num:03d}"

def validate_submission_requirements(
    db: Session,
    period_id: UUID,
    items: List[Any],
    student_code: Optional[str],
    target_type: str,
    exclude_application_id: Optional[UUID] = None
):
    """
    Kiểm tra 3 điều kiện bắt buộc khi nộp hồ sơ SV5T:
    1. Có ít nhất 1 file minh chứng đính kèm.
    2. Đạt đủ toàn bộ tiêu chuẩn bắt buộc (REQUIRED) và mỗi nhóm 'Chọn ít nhất N trong M' phải đạt tối thiểu N.
    3. Với hồ sơ cá nhân: student_code không được để trống và không trùng trong cùng đợt.
    """
    # 1. Kiểm tra minh chứng đính kèm
    has_evidence = False
    for it in items:
        # it can be AwardApplicationItem or dict/pydantic
        files = getattr(it, 'evidence_files', None) if not isinstance(it, dict) else it.get('evidence_files')
        if files and len(files) > 0:
            has_evidence = True
            break
            
    if not has_evidence:
        raise HTTPException(
            status_code=400,
            detail="Hồ sơ bắt buộc phải đính kèm ít nhất 1 tệp minh chứng."
        )

    # 2. Kiểm tra bộ tiêu chuẩn của đợt
    standards = db.query(AwardStandard).filter(AwardStandard.period_id == period_id).all()
    selected_standard_ids = set()
    for it in items:
        is_sel = getattr(it, 'is_selected', False) if not isinstance(it, dict) else it.get('is_selected', False)
        std_id = getattr(it, 'standard_id', None) if not isinstance(it, dict) else it.get('standard_id')
        if is_sel and std_id:
            selected_standard_ids.add(str(std_id))

    # Check REQUIRED
    required_stds = [s for s in standards if s.rule_type == "REQUIRED"]
    missing_required = [s.title for s in required_stds if str(s.id) not in selected_standard_ids]
    if missing_required:
        raise HTTPException(
            status_code=400,
            detail=f"Chưa tích chọn đủ tiêu chuẩn bắt buộc: {missing_required[0]}"
        )

    # Check GROUP_SELECT
    group_map = {}
    for s in standards:
        if s.rule_type == "GROUP_SELECT" and s.group_code:
            group_map.setdefault(s.group_code, []).append(s)

    for g_code, std_list in group_map.items():
        min_count = std_list[0].min_select_count or 1
        g_name = std_list[0].group_name or f"Nhóm {g_code}"
        selected_in_group = sum(1 for s in std_list if str(s.id) in selected_standard_ids)
        if selected_in_group < min_count:
            raise HTTPException(
                status_code=400,
                detail=f"{g_name}: Bạn cần chọn ít nhất {min_count} tiêu chuẩn (hiện mới chọn {selected_in_group})."
            )

    # 3. Kiểm tra trùng MSSV trong đợt
    if target_type == "INDIVIDUAL":
        if not student_code or not student_code.strip():
            raise HTTPException(status_code=400, detail="Mã số sinh viên (MSSV) không được để trống.")
        
        dup_query = db.query(Award).filter(
            Award.period_id == period_id,
            Award.student_code == student_code.strip(),
            Award.status != "DRAFT"
        )
        if exclude_application_id:
            dup_query = dup_query.filter(Award.id != exclude_application_id)
        if dup_query.first():
            raise HTTPException(
                status_code=400,
                detail=f"Sinh viên có MSSV {student_code} đã có hồ sơ nộp trong đợt khen thưởng này."
            )

def log_approval_history(
    db: Session,
    application_id: UUID,
    action: str,
    from_status: Optional[str],
    to_status: Optional[str],
    actor: Optional[User],
    note: Optional[str] = None
):
    history = AwardApprovalHistory(
        application_id=application_id,
        action=action,
        from_status=from_status,
        to_status=to_status,
        actor_id=actor.id if actor else None,
        actor_name=actor.full_name if actor else "Hệ thống",
        note=note
    )
    db.add(history)
    db.commit()
    return history

# ==========================================
# SV5T Subsystem: Applications (CRUD & State Machine)
# ==========================================

def get_applications(
    db: Session,
    period_id: Optional[UUID] = None,
    status: Optional[str] = None,
    year: Optional[int] = None,
    target_type: Optional[str] = None,
    organization_id: Optional[UUID] = None,
    keyword: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(Award).options(
        joinedload(Award.period),
        joinedload(Award.organization),
        joinedload(Award.creator)
    )
    
    if period_id:
        query = query.filter(Award.period_id == period_id)
    if status and status != "ALL":
        query = query.filter(Award.status == status)
    if year:
        query = query.join(AwardPeriod, Award.period_id == AwardPeriod.id, isouter=True).filter(AwardPeriod.year == year)
    if target_type and target_type != "ALL":
        query = query.filter(Award.target_type == target_type)
    if organization_id:
        # Hỗ trợ phân quyền cấp Khoa (Faculty Scoping): Lấy hồ sơ thuộc Khoa hoặc các Chi đoàn con của Khoa
        child_org_ids = [r[0] for r in db.query(Organization.id).filter(Organization.parent_id == organization_id).all()]
        all_org_ids = [organization_id] + child_org_ids
        query = query.filter(Award.organization_id.in_(all_org_ids))
    if keyword:
        kw = f"%{keyword.strip()}%"
        query = query.filter(
            or_(
                Award.full_name.ilike(kw),
                Award.student_code.ilike(kw),
                Award.application_code.ilike(kw),
                Award.class_name.ilike(kw),
                Award.faculty_name.ilike(kw)
            )
        )

    apps = query.order_by(Award.created_at.desc()).offset(skip).limit(limit).all()
    
    # Map additional fields
    res = []
    for a in apps:
        a_dict = {
            "id": a.id,
            "application_code": a.application_code,
            "period_id": a.period_id,
            "period_code": a.period.code if a.period else None,
            "period_name": a.period.name if a.period else None,
            "target_type": a.target_type,
            "full_name": a.full_name,
            "student_code": a.student_code,
            "student_id": a.student_code, # alias
            "school_name": a.school_name,
            "faculty_name": a.faculty_name,
            "class_name": a.class_name,
            "university": a.school_name or a.class_name, # alias
            "education_level": a.education_level,
            "gpa": a.gpa,
            "training_score": a.training_score,
            "status": a.status,
            "is_late_submission": a.is_late_submission,
            "created_by_id": a.created_by_id,
            "creator_name": a.creator.full_name if a.creator else None,
            "organization_id": a.organization_id,
            "organization_name": a.organization.name if a.organization else None,
            "achievement_summary": a.achievement_summary,
            "legal_commitment": a.legal_commitment,
            "created_at": a.created_at,
            "updated_at": a.updated_at,
            "award_name": a.award_name or "Danh hiệu Sinh viên 5 Tốt",
            "points": a.points or 0
        }
        res.append(a_dict)
    return res

def get_application_detail(db: Session, app_id: UUID):
    app = db.query(Award).options(
        joinedload(Award.period),
        joinedload(Award.organization),
        joinedload(Award.creator),
        joinedload(Award.items).joinedload(AwardApplicationItem.standard),
        joinedload(Award.histories)
    ).filter(Award.id == app_id).first()

    if not app:
        raise HTTPException(status_code=404, detail="Không tìm thấy hồ sơ xét chọn")

    items_data = []
    for it in app.items:
        std_dict = None
        if it.standard:
            std_dict = {
                "id": it.standard.id,
                "period_id": it.standard.period_id,
                "criteria_name": it.standard.criteria_name,
                "title": it.standard.title,
                "evidence_requirement": it.standard.evidence_requirement,
                "document_reference": it.standard.document_reference,
                "rule_type": it.standard.rule_type,
                "group_code": it.standard.group_code,
                "group_name": it.standard.group_name,
                "min_select_count": it.standard.min_select_count,
                "order_num": it.standard.order_num
            }
        items_data.append({
            "id": it.id,
            "application_id": it.application_id,
            "standard_id": it.standard_id,
            "is_selected": it.is_selected,
            "explanation": it.explanation,
            "evidence_files": it.evidence_files or [],
            "eval_status": it.eval_status,
            "eval_note": it.eval_note,
            "is_temp_saved": it.is_temp_saved,
            "standard": std_dict
        })

    histories_data = []
    for h in sorted(app.histories, key=lambda x: x.created_at, reverse=True):
        histories_data.append({
            "id": h.id,
            "application_id": h.application_id,
            "action": h.action,
            "from_status": h.from_status,
            "to_status": h.to_status,
            "actor_id": h.actor_id,
            "actor_name": h.actor_name,
            "note": h.note,
            "created_at": h.created_at
        })

    return {
        "id": app.id,
        "application_code": app.application_code,
        "period_id": app.period_id,
        "period_code": app.period.code if app.period else None,
        "period_name": app.period.name if app.period else None,
        "user_id": app.user_id,
        "created_by_id": app.created_by_id,
        "creator_name": app.creator.full_name if app.creator else None,
        "organization_id": app.organization_id,
        "organization_name": app.organization.name if app.organization else None,
        "target_type": app.target_type,
        "full_name": app.full_name,
        "address": app.address,
        "date_of_birth": app.date_of_birth,
        "gender": app.gender,
        "cccd": app.cccd,
        "ethnicity": app.ethnicity,
        "religion": app.religion,
        "student_code": app.student_code,
        "academic_year_num": app.academic_year_num,
        "school_name": app.school_name,
        "faculty_name": app.faculty_name,
        "class_name": app.class_name,
        "education_level": app.education_level,
        "gpa": app.gpa,
        "training_score": app.training_score,
        "union_position": app.union_position,
        "political_status": app.political_status,
        "phone_number": app.phone_number,
        "email": app.email,
        "achievement_summary": app.achievement_summary,
        "legal_commitment": app.legal_commitment,
        "is_late_submission": app.is_late_submission,
        "status": app.status,
        "created_at": app.created_at,
        "updated_at": app.updated_at,
        "items": items_data,
        "histories": histories_data,
        "award_name": app.award_name or "Danh hiệu Sinh viên 5 Tốt",
        "student_id": app.student_code,
        "university": app.school_name
    }

def create_application(db: Session, app_in: AwardApplicationCreate, current_user: User):
    """
    Tạo mới hồ sơ xét chọn (Nháp hoặc Nộp trực tiếp).
    """
    period = None
    if app_in.period_id:
        period = db.query(AwardPeriod).filter(AwardPeriod.id == app_in.period_id).first()
        if not period:
            raise HTTPException(status_code=404, detail="Không tìm thấy đợt khen thưởng")
            
    is_draft = app_in.is_draft
    is_late = False
    now = datetime.now(timezone.utc)
    
    if period and period.submission_deadline:
        deadline = period.submission_deadline
        if deadline.tzinfo is None:
            deadline = deadline.replace(tzinfo=timezone.utc)
        if now > deadline:
            is_late = True

    # Nếu không phải lưu nháp, kiểm tra điều kiện đợt và điều kiện nộp
    if not is_draft:
        if period and period.status != "ONGOING":
            raise HTTPException(
                status_code=400,
                detail="Đợt khen thưởng hiện không ở trạng thái 'Đang diễn ra'. Không thể nộp hồ sơ."
            )
        validate_submission_requirements(
            db=db,
            period_id=app_in.period_id,
            items=app_in.items or [],
            student_code=app_in.student_code,
            target_type=app_in.target_type
        )
        # Determine starting status
        user_role = get_user_sv5t_role(current_user)
        initial_status = "PENDING_PROVINCE"
    else:
        initial_status = "DRAFT"

    year = period.year if period else date.today().year
    app_code = generate_application_code(db, year)

    # Resolve organization if not provided
    org_id = app_in.organization_id
    if not org_id and current_user.organizations:
        org_id = current_user.organizations[0].organization_id

    app_data = app_in.model_dump(exclude={"items", "is_draft", "organization_id"})
    db_app = Award(
        **app_data,
        application_code=app_code,
        status=initial_status,
        is_late_submission=is_late,
        created_by_id=current_user.id,
        user_id=current_user.id if app_in.target_type == "INDIVIDUAL" else None,
        organization_id=org_id
    )
    db.add(db_app)
    db.commit()
    db.refresh(db_app)

    # Save Items
    if app_in.items:
        for it in app_in.items:
            db_item = AwardApplicationItem(
                application_id=db_app.id,
                standard_id=it.standard_id,
                is_selected=it.is_selected,
                explanation=it.explanation,
                evidence_files=it.evidence_files or []
            )
            db.add(db_item)
        db.commit()

    # Log History
    action_name = "Lưu nháp hồ sơ" if is_draft else "Nộp hồ sơ lên Đoàn Trường"
    log_approval_history(
        db=db,
        application_id=db_app.id,
        action=action_name,
        from_status=None,
        to_status=initial_status,
        actor=current_user,
        note="Gửi muộn sau hạn chót nộp" if is_late else None
    )

    return get_application_detail(db, db_app.id)

def update_application(db: Session, app_id: UUID, app_in: AwardApplicationUpdate, current_user: User):
    """
    Cập nhật hoặc Bổ sung hồ sơ SV5T.
    """
    db_app = db.query(Award).filter(Award.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Không tìm thấy hồ sơ")

    user_role = get_user_sv5t_role(current_user)
    current_status = db_app.status

    # Check permission to edit based on state machine
    if current_status in ["DRAFT", "RETURNED"]:
        if user_role != "ADMIN" and db_app.created_by_id != current_user.id:
            raise HTTPException(status_code=403, detail="Chỉ người lập hồ sơ mới có quyền chỉnh sửa")
    elif current_status == "PROVINCE_RETURNED":
        # Any school officer of that school or admin
        pass
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Hồ sơ đang ở trạng thái '{current_status}'. Không được phép chỉnh sửa nội dung."
        )

    is_submitting_now = not app_in.is_draft and current_status == "DRAFT"
    if is_submitting_now:
        period = db.query(AwardPeriod).filter(AwardPeriod.id == db_app.period_id).first()
        if period and period.status != "ONGOING":
            raise HTTPException(status_code=400, detail="Đợt khen thưởng hiện không ở trạng thái 'Đang diễn ra'.")
        validate_submission_requirements(
            db=db,
            period_id=db_app.period_id,
            items=app_in.items or db_app.items,
            student_code=app_in.student_code or db_app.student_code,
            target_type=app_in.target_type or db_app.target_type,
            exclude_application_id=db_app.id
        )
        db_app.status = "PENDING_PROVINCE"

    # Update basic fields
    update_data = app_in.model_dump(exclude={"items", "is_draft"}, exclude_unset=True)
    for field, val in update_data.items():
        setattr(db_app, field, val)

    # Check late submission
    if period := db_app.period:
        now = datetime.now(timezone.utc)
        deadline = period.submission_deadline
        if deadline and deadline.tzinfo is None:
            deadline = deadline.replace(tzinfo=timezone.utc)
        if deadline and now > deadline:
            db_app.is_late_submission = True

    # Update items if provided
    if app_in.items is not None:
        db.query(AwardApplicationItem).filter(AwardApplicationItem.application_id == app_id).delete()
        for it in app_in.items:
            db_item = AwardApplicationItem(
                application_id=app_id,
                standard_id=it.standard_id,
                is_selected=it.is_selected,
                explanation=it.explanation,
                evidence_files=it.evidence_files or []
            )
            db.add(db_item)

    db.commit()
    db.refresh(db_app)

    # Log History
    if current_status == "PROVINCE_RETURNED":
        action_name = "Bổ sung hồ sơ"
    elif is_submitting_now:
        action_name = "Nộp hồ sơ lên Đoàn Trường"
    else:
        action_name = "Cập nhật thông tin hồ sơ"

    log_approval_history(
        db=db,
        application_id=db_app.id,
        action=action_name,
        from_status=current_status,
        to_status=db_app.status,
        actor=current_user
    )

    return get_application_detail(db, db_app.id)

def submit_application_to_province(db: Session, app_id: UUID, current_user: User):
    """
    Nộp hồ sơ từ DRAFT / RETURNED / PROVINCE_RETURNED lên PENDING_PROVINCE.
    """
    db_app = db.query(Award).filter(Award.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Không tìm thấy hồ sơ")

    old_status = db_app.status
    if old_status not in ["DRAFT", "PENDING_SCHOOL", "RETURNED", "PROVINCE_RETURNED"]:
        raise HTTPException(status_code=400, detail=f"Không thể gửi hồ sơ ở trạng thái '{old_status}'")

    period = db.query(AwardPeriod).filter(AwardPeriod.id == db_app.period_id).first()
    if period and period.status != "ONGOING":
        raise HTTPException(status_code=400, detail="Đợt khen thưởng hiện không ở trạng thái 'Đang diễn ra'.")

    validate_submission_requirements(
        db=db,
        period_id=db_app.period_id,
        items=db_app.items,
        student_code=db_app.student_code,
        target_type=db_app.target_type,
        exclude_application_id=db_app.id
    )

    now = datetime.now(timezone.utc)
    if period and period.submission_deadline:
        deadline = period.submission_deadline
        if deadline.tzinfo is None:
            deadline = deadline.replace(tzinfo=timezone.utc)
        if now > deadline:
            db_app.is_late_submission = True

    db_app.status = "PENDING_PROVINCE"
    db.commit()
    db.refresh(db_app)

    action_text = "Bổ sung và nộp lại hồ sơ" if old_status == "PROVINCE_RETURNED" else "Gửi lên Đoàn Trường"
    log_approval_history(
        db=db,
        application_id=db_app.id,
        action=action_text,
        from_status=old_status,
        to_status="PENDING_PROVINCE",
        actor=current_user,
        note="Gửi muộn sau hạn chót nộp" if db_app.is_late_submission else None
    )

    return get_application_detail(db, db_app.id)

# ==========================================
# SV5T Subsystem: City Evaluation (Chấm điểm & Kết luận)
# ==========================================

def evaluate_application_items(db: Session, app_id: UUID, eval_req: AwardEvaluateRequest, current_user: User):
    """
    Chấm điểm từng tiêu chuẩn (Lưu tạm hoặc cập nhật đánh giá).
    """
    db_app = db.query(Award).filter(Award.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Không tìm thấy hồ sơ")

    user_role = get_user_sv5t_role(current_user)
    if user_role not in ["ADMIN", "PROVINCE"]:
        raise HTTPException(status_code=403, detail="Chỉ Ban Thường vụ Đoàn Trường hoặc Admin mới có quyền chấm điểm")

    for eval_item in eval_req.items:
        item = None
        if eval_item.item_id:
            item = db.query(AwardApplicationItem).filter(AwardApplicationItem.id == eval_item.item_id).first()
        elif eval_item.standard_id:
            item = db.query(AwardApplicationItem).filter(
                AwardApplicationItem.application_id == app_id,
                AwardApplicationItem.standard_id == eval_item.standard_id
            ).first()
            
        if item:
            item.eval_status = eval_item.eval_status
            item.eval_note = eval_item.eval_note
            item.is_temp_saved = eval_req.is_temp_save

    db.commit()

    action_text = "Lưu tạm kết quả chấm điểm" if eval_req.is_temp_save else "Cập nhật kết quả chấm điểm"
    log_approval_history(
        db=db,
        application_id=db_app.id,
        action=action_text,
        from_status=db_app.status,
        to_status=db_app.status,
        actor=current_user
    )

    return get_application_detail(db, db_app.id)

def conclude_application_evaluation(db: Session, app_id: UUID, req: AwardConcludeRequest, current_user: User):
    """
    Kết luận thẩm định: 'QUALIFIED' (Đủ tiêu chuẩn) hoặc 'RETURN_TO_SCHOOL' (Trả về trường).
    """
    db_app = db.query(Award).filter(Award.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Không tìm thấy hồ sơ")

    user_role = get_user_sv5t_role(current_user)
    if user_role not in ["ADMIN", "PROVINCE"]:
        raise HTTPException(status_code=403, detail="Chỉ Ban Thường vụ Đoàn Trường hoặc Admin mới có quyền ra kết luận")

    old_status = db_app.status

    if req.conclusion == "QUALIFIED":
        # Mark temp saved items as confirmed
        for item in db_app.items:
            item.is_temp_saved = False
        db_app.status = "QUALIFIED"
        action_text = "Xác nhận hồ sơ Đủ tiêu chuẩn"
        note_text = req.reason
    elif req.conclusion == "RETURN_TO_SCHOOL":
        if not req.reason or not req.reason.strip():
            raise HTTPException(status_code=400, detail="Bắt buộc phải nhập lý do khi yêu cầu bổ sung hồ sơ về Khoa/Sinh viên.")
        db_app.status = "PROVINCE_RETURNED"
        action_text = "Đoàn Trường yêu cầu bổ sung hồ sơ"
        note_text = req.reason.strip()
    else:
        raise HTTPException(status_code=400, detail=f"Kết luận '{req.conclusion}' không hợp lệ")

    db.commit()
    db.refresh(db_app)

    log_approval_history(
        db=db,
        application_id=db_app.id,
        action=action_text,
        from_status=old_status,
        to_status=db_app.status,
        actor=current_user,
        note=note_text
    )

    return get_application_detail(db, db_app.id)

# ==========================================
# SV5T Subsystem: Leader Decision & School Feedback
# ==========================================

def leader_make_decision(db: Session, app_id: UUID, req: AwardDecisionRequest, current_user: User):
    """
    Chủ tịch hội đồng ra quyết định: 'APPROVED', 'REJECTED', 'RETURNED'.
    """
    db_app = db.query(Award).filter(Award.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Không tìm thấy hồ sơ")

    user_role = get_user_sv5t_role(current_user)
    if user_role not in ["ADMIN", "LEADER"]:
        raise HTTPException(status_code=403, detail="Chỉ Chủ tịch hội đồng hoặc Admin mới có quyền ra quyết định cuối cùng")

    old_status = db_app.status
    decision = req.decision.upper()

    if decision == "APPROVED":
        db_app.status = "APPROVED"
        db_app.awarded_date = date.today()
        action_text = "Phê duyệt hồ sơ"
    elif decision == "REJECTED":
        if not req.note or not req.note.strip():
            raise HTTPException(status_code=400, detail="Bắt buộc phải nhập lý do từ chối hồ sơ.")
        db_app.status = "REJECTED"
        action_text = "Từ chối hồ sơ"
    elif decision == "RETURNED":
        if not req.note or not req.note.strip():
            raise HTTPException(status_code=400, detail="Bắt buộc phải nhập lý do trả lại hồ sơ.")
        db_app.status = "RETURNED"
        action_text = "Chủ tịch hội đồng trả lại hồ sơ"
    else:
        raise HTTPException(status_code=400, detail=f"Quyết định '{req.decision}' không hợp lệ")

    db.commit()
    db.refresh(db_app)

    log_approval_history(
        db=db,
        application_id=db_app.id,
        action=action_text,
        from_status=old_status,
        to_status=db_app.status,
        actor=current_user,
        note=req.note
    )

    return get_application_detail(db, db_app.id)

def school_give_feedback(db: Session, app_id: UUID, req: AwardFeedbackRequest, current_user: User):
    """
    Cán bộ trường/khoa góp ý chỉnh sửa cho người lập (chuyển về RETURNED).
    """
    db_app = db.query(Award).filter(Award.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Không tìm thấy hồ sơ")

    if not req.note or not req.note.strip():
        raise HTTPException(status_code=400, detail="Bắt buộc phải nhập nội dung góp ý chỉnh sửa.")

    old_status = db_app.status
    db_app.status = "RETURNED"
    db.commit()
    db.refresh(db_app)

    log_approval_history(
        db=db,
        application_id=db_app.id,
        action="Góp ý chỉnh sửa",
        from_status=old_status,
        to_status="RETURNED",
        actor=current_user,
        note=req.note.strip()
    )

    return get_application_detail(db, db_app.id)

# ==========================================
# SV5T Subsystem: Histories & Dashboard Thống kê
# ==========================================

def get_approval_histories(
    db: Session,
    period_id: Optional[UUID] = None,
    actor_id: Optional[UUID] = None,
    action: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(AwardApprovalHistory).join(Award, AwardApprovalHistory.application_id == Award.id)
    if period_id:
        query = query.filter(Award.period_id == period_id)
    if actor_id:
        query = query.filter(AwardApprovalHistory.actor_id == actor_id)
    if action and action != "ALL":
        query = query.filter(AwardApprovalHistory.action == action)
    if status and status != "ALL":
        query = query.filter(AwardApprovalHistory.to_status == status)

    histories = query.order_by(AwardApprovalHistory.created_at.desc()).offset(skip).limit(limit).all()
    return histories

def get_sv5t_dashboard_stats(db: Session, period_id: Optional[UUID] = None, year: Optional[int] = None):
    """
    Tính toán 6 chỉ số tổng hợp và 4 tập dữ liệu biểu đồ cho Dashboard SV5T.
    """
    query = db.query(Award)
    if period_id:
        query = query.filter(Award.period_id == period_id)
    if year:
        query = query.join(AwardPeriod, Award.period_id == AwardPeriod.id, isouter=True).filter(AwardPeriod.year == year)

    apps = query.all()
    total_apps = len(apps)

    party_count = sum(1 for a in apps if (a.political_status or "").lower() == "đảng viên")
    union_count = sum(1 for a in apps if (a.political_status or "").lower() == "đoàn viên")
    passed_count = sum(1 for a in apps if a.status == "APPROVED")
    failed_count = sum(1 for a in apps if a.status in ["REJECTED", "UNQUALIFIED"])
    reviewing_count = sum(1 for a in apps if a.status in ["PENDING_SCHOOL", "PENDING_PROVINCE", "PROVINCE_RETURNED", "QUALIFIED"])

    # 1. Chart: By period
    periods = db.query(AwardPeriod).order_by(AwardPeriod.year.asc()).all()
    by_period = []
    for p in periods:
        p_apps = [a for a in apps if a.period_id == p.id] if period_id or year else db.query(Award).filter(Award.period_id == p.id).all()
        by_period.append({
            "name": p.code,
            "total": len(p_apps),
            "approved": sum(1 for a in p_apps if a.status == "APPROVED"),
            "reviewing": sum(1 for a in p_apps if a.status in ["PENDING_PROVINCE", "QUALIFIED", "PENDING_SCHOOL"])
        })

    # 2. Chart: Party/Union ratio
    other_political = total_apps - party_count - union_count
    party_union_ratio = [
        {"name": "Đảng viên", "value": party_count, "color": "#059669"}, # emerald
        {"name": "Đoàn viên", "value": union_count, "color": "#2563EB"}, # blue
        {"name": "Khác", "value": max(0, other_political), "color": "#94A3B8"} # slate
    ]

    # 3. Chart: By academic year
    academic_map = {}
    for a in apps:
        yr = a.academic_year_num or 1
        key = f"Năm {yr}"
        academic_map[key] = academic_map.get(key, 0) + 1
    by_academic_year = [{"name": k, "count": v} for k, v in sorted(academic_map.items())]

    # 4. Chart: By education level or school
    edu_map = {}
    for a in apps:
        level = a.education_level or "Đại học"
        edu_map[level] = edu_map.get(level, 0) + 1
    by_education_level = [{"name": k, "count": v} for k, v in sorted(edu_map.items())]

    return {
        "total_applications": total_apps,
        "party_members_count": party_count,
        "union_members_count": union_count,
        "passed_count": passed_count,
        "failed_count": failed_count,
        "reviewing_count": reviewing_count,
        "by_period": by_period,
        "party_union_ratio": party_union_ratio,
        "by_academic_year": by_academic_year,
        "by_education_level": by_education_level
    }
