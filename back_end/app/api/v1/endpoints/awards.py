from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from uuid import UUID

from app.api.deps import get_db, get_current_active_user, get_current_active_admin
from app.schemas.award_schemas import (
    AwardCreate, AwardUpdate, AwardResponse,
    AwardCriteriaCreate, AwardCriteriaResponse,
    AwardPeriodCreate, AwardPeriodUpdate, AwardPeriodResponse,
    AwardStandardCreate, AwardStandardUpdate, AwardStandardResponse,
    AwardApplicationCreate, AwardApplicationUpdate, AwardApplicationResponse,
    AwardApprovalHistoryResponse,
    AwardEvaluateRequest, AwardConcludeRequest, AwardDecisionRequest, AwardFeedbackRequest,
    SV5TDashboardResponse
)
from app.models.core import User
from app.models.awards import Award, AwardCriteria, AwardStatus
from app.models.core import User as DBUser, UserOrganization
from app.services import award_service

router = APIRouter()

# ==========================================
# SV5T Periods (Đợt khen thưởng)
# ==========================================

@router.get("/periods", response_model=List[AwardPeriodResponse])
def get_periods(
    status: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    keyword: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Danh sách các đợt khen thưởng SV5T có lọc và tìm kiếm.
    """
    return award_service.get_periods(db=db, skip=skip, limit=limit, status=status, year=year, keyword=keyword)

@router.get("/periods/{period_id}", response_model=AwardPeriodResponse)
def get_period(
    period_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Chi tiết một đợt khen thưởng SV5T.
    """
    return award_service.get_period_by_id(db=db, period_id=period_id)

@router.post("/periods", response_model=AwardPeriodResponse)
def create_period(
    period_in: AwardPeriodCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_active_admin)
):
    """
    Tạo đợt khen thưởng mới (Dành cho Quản trị viên).
    """
    return award_service.create_period(db=db, period_in=period_in, current_user=current_admin)

@router.put("/periods/{period_id}", response_model=AwardPeriodResponse)
def update_period(
    period_id: UUID,
    period_in: AwardPeriodUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_active_admin)
):
    """
    Cập nhật thông tin đợt khen thưởng.
    """
    return award_service.update_period(db=db, period_id=period_id, period_in=period_in, current_user=current_admin)

@router.delete("/periods/{period_id}")
def delete_period(
    period_id: UUID,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_active_admin)
):
    """
    Xóa đợt khen thưởng (chỉ khi chưa có hồ sơ nộp).
    """
    return award_service.delete_period(db=db, period_id=period_id, current_user=current_admin)

# ==========================================
# SV5T Standards (Tiêu chuẩn 5 Tốt)
# ==========================================

@router.get("/periods/{period_id}/standards", response_model=List[AwardStandardResponse])
def get_standards(
    period_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách các tiêu chuẩn 5 Tốt của một đợt khen thưởng.
    """
    return award_service.get_standards_by_period(db=db, period_id=period_id)

@router.post("/periods/{period_id}/standards", response_model=AwardStandardResponse)
def create_standard(
    period_id: UUID,
    standard_in: AwardStandardCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_active_admin)
):
    """
    Thêm tiêu chuẩn mới vào đợt khen thưởng.
    """
    standard_in.period_id = period_id
    return award_service.create_standard(db=db, standard_in=standard_in, current_user=current_admin)

@router.put("/standards/{standard_id}", response_model=AwardStandardResponse)
def update_standard(
    standard_id: UUID,
    standard_in: AwardStandardUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_active_admin)
):
    """
    Cập nhật nội dung tiêu chuẩn.
    """
    return award_service.update_standard(db=db, standard_id=standard_id, standard_in=standard_in, current_user=current_admin)

@router.delete("/standards/{standard_id}")
def delete_standard(
    standard_id: UUID,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_active_admin)
):
    """
    Xóa một tiêu chuẩn.
    """
    return award_service.delete_standard(db=db, standard_id=standard_id, current_user=current_admin)

# ==========================================
# SV5T Applications (Hồ sơ xét chọn)
# ==========================================

@router.get("/applications", response_model=List[AwardApplicationResponse])
def get_applications(
    period_id: Optional[UUID] = Query(None),
    status: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    target_type: Optional[str] = Query(None),
    organization_id: Optional[UUID] = Query(None),
    keyword: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách hồ sơ đề nghị khen thưởng SV5T theo các tiêu chí lọc.
    """
    return award_service.get_applications(
        db=db,
        period_id=period_id,
        status=status,
        year=year,
        target_type=target_type,
        organization_id=organization_id,
        keyword=keyword,
        skip=skip,
        limit=limit
    )

@router.get("/applications/{application_id}", response_model=AwardApplicationResponse)
def get_application(
    application_id: UUID,
    db: Session = Depends(get_db)
):
    """
    Lấy chi tiết hồ sơ SV5T bao gồm bảng minh chứng các tiêu chuẩn và lịch sử xét duyệt.
    """
    return award_service.get_application_detail(db=db, app_id=application_id)

@router.post("/applications", response_model=AwardApplicationResponse)
def create_application(
    app_in: AwardApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Lập hồ sơ xét chọn mới (Hỗ trợ cờ is_draft=True để lưu nháp).
    """
    return award_service.create_application(db=db, app_in=app_in, current_user=current_user)

@router.put("/applications/{application_id}", response_model=AwardApplicationResponse)
def update_application(
    application_id: UUID,
    app_in: AwardApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Chỉnh sửa thông tin hoặc bổ sung hồ sơ theo phân quyền trạng thái.
    """
    return award_service.update_application(db=db, app_id=application_id, app_in=app_in, current_user=current_user)

@router.post("/applications/{application_id}/submit", response_model=AwardApplicationResponse)
def submit_application(
    application_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Nộp hồ sơ lên Đoàn Trường / Nộp lại hồ sơ sau khi bổ sung.
    """
    return award_service.submit_application_to_province(db=db, app_id=application_id, current_user=current_user)

@router.post("/applications/{application_id}/evaluate", response_model=AwardApplicationResponse)
def evaluate_items(
    application_id: UUID,
    eval_req: AwardEvaluateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Chấm điểm từng tiêu chuẩn (cho phép Lưu tạm bằng cờ is_temp_save=True).
    """
    return award_service.evaluate_application_items(db=db, app_id=application_id, eval_req=eval_req, current_user=current_user)

@router.post("/applications/{application_id}/conclude", response_model=AwardApplicationResponse)
def conclude_evaluation(
    application_id: UUID,
    req: AwardConcludeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Kết luận thẩm định: 'QUALIFIED' (Đủ tiêu chuẩn cấp Trường) hoặc 'RETURN_TO_SCHOOL' (Đoàn Trường yêu cầu bổ sung).
    """
    return award_service.conclude_application_evaluation(db=db, app_id=application_id, req=req, current_user=current_user)

@router.post("/applications/{application_id}/decision", response_model=AwardApplicationResponse)
def leader_decision(
    application_id: UUID,
    req: AwardDecisionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Quyết định của Chủ tịch hội đồng: 'APPROVED' (Phê duyệt), 'REJECTED' (Từ chối), 'RETURNED' (Trả lại).
    """
    return award_service.leader_make_decision(db=db, app_id=application_id, req=req, current_user=current_user)

@router.post("/applications/{application_id}/feedback", response_model=AwardApplicationResponse)
def school_feedback(
    application_id: UUID,
    req: AwardFeedbackRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Ban Chấp hành Đoàn Khoa góp ý chỉnh sửa cho người lập (chuyển trạng thái về RETURNED kèm lý do).
    """
    return award_service.school_give_feedback(db=db, app_id=application_id, req=req, current_user=current_user)

# ==========================================
# SV5T Histories & Dashboard
# ==========================================

@router.get("/histories", response_model=List[AwardApprovalHistoryResponse])
def get_histories(
    period_id: Optional[UUID] = Query(None),
    actor_id: Optional[UUID] = Query(None),
    action: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Tra cứu toàn bộ lịch sử xét duyệt hồ sơ SV5T.
    """
    return award_service.get_approval_histories(
        db=db,
        period_id=period_id,
        actor_id=actor_id,
        action=action,
        status=status,
        skip=skip,
        limit=limit
    )

@router.get("/sv5t-dashboard", response_model=SV5TDashboardResponse)
def get_sv5t_dashboard(
    period_id: Optional[UUID] = Query(None),
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Thống kê tổng quan SV5T (6 thẻ chỉ số và 4 tập dữ liệu biểu đồ Recharts).
    """
    return award_service.get_sv5t_dashboard_stats(db=db, period_id=period_id, year=year)

# ==========================================
# Legacy Endpoints (giữ nguyên để tương thích 100% với FE hiện tại)
# ==========================================

@router.post("/", response_model=AwardResponse)
def create_award(
    *,
    db: Session = Depends(get_db),
    award_in: AwardCreate,
    current_user = Depends(get_current_active_user),
):
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if not is_admin:
        award_in.user_id = current_user.id
    return award_service.create_award_application(db=db, award_in=award_in)

@router.get("/", response_model=List[AwardResponse])
def read_awards(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if is_admin:
        return award_service.get_awards_list(db, skip=skip, limit=limit)
        
    # Lọc hồ sơ khen thưởng của chính sinh viên đăng nhập
    awards = db.query(Award).filter(Award.user_id == current_user.id).options(
        joinedload(Award.user).joinedload(DBUser.organizations).joinedload(UserOrganization.organization)
    ).offset(skip).limit(limit).all()
    
    for award in awards:
        if award.user:
            award.full_name = award.user.full_name
            award.student_id = award.user.student_id
            
            primary_org = next((uo.organization for uo in award.user.organizations if uo.is_primary), None)
            if not primary_org and award.user.organizations:
                primary_org = award.user.organizations[0].organization
            
            if primary_org:
                award.class_name = primary_org.name
                
    return awards

@router.get("/stats")
def read_award_stats(
    timescale: str = "Tháng này",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    return award_service.get_award_stats(db=db, timescale=timescale)

@router.get("/leaderboard")
def read_award_leaderboard(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    return award_service.get_full_leaderboard(db=db)

@router.get("/{award_id}", response_model=AwardResponse)
def read_award(
    award_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    try:
        app_detail = award_service.get_application_detail(db=db, app_id=award_id)
        is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN", "LEADER", "PROVINCE"] for role in current_user.roles)
        if not is_admin and getattr(app_detail, "user_id", None) != current_user.id:
            raise HTTPException(status_code=403, detail="Bạn không có quyền truy cập hồ sơ này")
        return app_detail
    except HTTPException:
        raise
    except Exception:
        award = db.query(Award).filter(Award.id == award_id).first()
        if not award:
            raise HTTPException(status_code=404, detail="Award not found")
        is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN", "LEADER", "PROVINCE"] for role in current_user.roles)
        if not is_admin and award.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Bạn không có quyền truy cập hồ sơ này")
        return award

@router.put("/{award_id}", response_model=AwardResponse)
def update_award(
    *,
    db: Session = Depends(get_db),
    award_id: UUID,
    award_in: AwardUpdate,
    current_user = Depends(get_current_active_user),
):
    award = db.query(Award).filter(Award.id == award_id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")
        
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if not is_admin and award.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bạn không có quyền chỉnh sửa hồ sơ này")
        
    updated_award = award_service.update_award_assessment(db=db, award_id=award_id, award_in=award_in)
    return updated_award

@router.delete("/{award_id}")
def delete_award(
    *,
    db: Session = Depends(get_db),
    award_id: UUID,
    current_user = Depends(get_current_active_user),
):
    award = db.query(Award).filter(Award.id == award_id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")
        
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if not is_admin and award.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bạn không có quyền xóa hồ sơ này")
        
    db.delete(award)
    db.commit()
    return {"message": "Award deleted successfully"}

# ==========================================
# Legacy Criteria Management
# ==========================================

@router.get("/criteria", response_model=List[AwardCriteriaResponse])
def get_criteria(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    return db.query(AwardCriteria).all()

@router.post("/criteria", response_model=AwardCriteriaResponse)
def create_criteria(
    *,
    db: Session = Depends(get_db),
    criteria_in: AwardCriteriaCreate,
    current_admin = Depends(get_current_active_admin),
):
    db_obj = AwardCriteria(**criteria_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/criteria/{criteria_id}")
def delete_criteria(
    *,
    db: Session = Depends(get_db),
    criteria_id: UUID,
    current_admin = Depends(get_current_active_admin),
):
    db_obj = db.query(AwardCriteria).filter(AwardCriteria.id == criteria_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Criteria not found")
    db.delete(db_obj)
    db.commit()
    return {"message": "Criteria deleted"}

