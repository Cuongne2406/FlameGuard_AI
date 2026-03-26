from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, desc
from typing import List, Optional
from uuid import UUID
from datetime import date, datetime
from app.models.awards import Award, AwardStatus, AwardCriteria, CriteriaType
from app.models.core import Organization, OrgType, AcademicTerm, User, UserOrganization
from app.models.events import EventRegistration, EventRegistrationStatus
from app.schemas.award_schemas import AwardCreate, AwardUpdate
from app.services.notification_service import create_notification
from app.schemas.notification_schemas import NotificationCreate

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
            # Giả định GPA lưu trong training_score tạm thời để test, hoặc mock 3.5
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
    Tạo đơn nộp thưởng kèm Sơ lọc ngay lập tức.
    """
    # 1. Thực hiện sơ lọc
    screening = check_award_eligibility(db, award_in.user_id)
    
    # 2. Tạo bản ghi Award (Loại trừ screening_results từ input để tránh trùng lặp)
    obj_data = award_in.model_dump(exclude={"screening_results"})
    db_obj = Award(
        **obj_data,
        screening_results=screening
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)

    # Gửi thông báo nộp thành công cho Sinh viên
    try:
        notif_in = NotificationCreate(
            user_id=db_obj.user_id,
            title="Đã lưu Hồ sơ Xét duyệt",
            message=f"Hồ sơ '{db_obj.award_name}' của bạn đã được ghi nhận và đang chờ Admin xét duyệt."
        )
        create_notification(db, notif_in)
    except Exception as e:
        print(f"Lỗi khi gửi thông báo nộp hồ sơ: {e}")

    return db_obj

def get_awards_list(db: Session, skip: int = 0, limit: int = 100):
    """
    Lấy danh sách bằng khen kèm thông tin User và Lớp.
    """
    awards = db.query(Award).options(
        joinedload(Award.user).joinedload(User.organizations).joinedload(UserOrganization.organization)
    ).offset(skip).limit(limit).all()
    
    # Chuẩn bị dữ liệu cho AwardResponse
    for award in awards:
        if award.user:
            award.full_name = award.user.full_name
            award.student_id = award.user.student_id
            
            # Lấy tổ chức chính (Lớp)
            primary_org = next((uo.organization for uo in award.user.organizations if uo.is_primary), None)
            if not primary_org and award.user.organizations:
                primary_org = award.user.organizations[0].organization
            
            if primary_org:
                award.university = primary_org.name
                
    return awards

def update_award_assessment(db: Session, award_id: UUID, award_in: AwardUpdate):
    """
    Cập nhật đánh giá cho bằng khen.
    """
    db_obj = db.query(Award).filter(Award.id == award_id).first()
    if not db_obj:
        return None
    
    update_data = award_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    # Tự động chuyển trạng thái khi được đánh giá
    if not db_obj.status or db_obj.status == AwardStatus.PENDING:
        db_obj.status = AwardStatus.APPROVED
        
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)

    # Gửi thông báo kết quả duyệt cho Sinh viên
    try:
        status_str = "ĐƯỢC DUYỆT" if db_obj.status == AwardStatus.APPROVED else "BỊ TỪ CHỐI"
        notif_msg = f"Hồ sơ '{db_obj.award_name}' của bạn đã {status_str}."
        if db_obj.comments:
            notif_msg += f" Kèm lời nhắn: {db_obj.comments}"
            
        notif_in = NotificationCreate(
            user_id=db_obj.user_id,
            title=f"Kết quả Khảo thí: {status_str}",
            message=notif_msg
        )
        create_notification(db, notif_in)
    except Exception as e:
        print(f"Lỗi khi gửi thông báo kết quả xét duyệt: {e}")

    return db_obj

def get_award_stats(db: Session, timescale: str = "Tháng này"):
    # 1. Lấy thông tin học kỳ hiện tại để tính ngày còn lại
    current_term = db.query(AcademicTerm).filter(AcademicTerm.is_current == True).first()
    remaining_days = "N/A"
    if current_term and current_term.end_date:
        delta = current_term.end_date - date.today()
        remaining_days = str(max(0, delta.days))

    # 2. Thống kê hồ sơ
    total_submitted = db.query(Award).count()
    total_approved = db.query(Award).filter(Award.status == AwardStatus.APPROVED).count()
    pass_rate = "0%"
    if total_submitted > 0:
        pass_rate = f"{int((total_approved / total_submitted) * 100)}%"

    # 3. Lấy danh sách Chi đoàn xếp hạng (OrgType.CLASS)
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

    # 4. Tìm Chi đoàn cần cảnh báo
    warning_org = db.query(Organization).filter(
        Organization.type == OrgType.CLASS
    ).order_by(Organization.activity_points.asc()).first()
    
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
                "progress": int((total_approved/total_submitted*100)) if total_submitted > 0 else 0,
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
