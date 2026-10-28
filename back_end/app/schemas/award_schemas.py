from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from uuid import UUID
from datetime import date, datetime
from app.models.awards import AwardStatus, AwardPeriodStatus, StandardRuleType, TargetType

# ==========================================
# Legacy Award Criteria Schemas
# ==========================================
class AwardCriteriaBase(BaseModel):
    name: str
    type: str # Vai trò Enum: MIN_GPA, MIN_TRAINING_SCORE, etc.
    value: str
    is_required: bool = True
    description: Optional[str] = None

class AwardCriteriaCreate(AwardCriteriaBase):
    pass

class AwardCriteriaResponse(AwardCriteriaBase):
    id: UUID
    class Config:
        from_attributes = True

# ==========================================
# Award Period (Đợt Khen thưởng SV5T)
# ==========================================
class AwardPeriodBase(BaseModel):
    code: str # e.g. SV5T-2026-2027
    name: str # Xét chọn Danh hiệu Sinh viên 5 Tốt cấp Trường
    year: int
    description: Optional[str] = None
    start_date: date
    end_date: date
    submission_deadline: datetime
    decision_file_url: Optional[str] = None
    quotas: Optional[Dict[str, Any]] = None
    status: str = "UPCOMING" # UPCOMING, ONGOING, ENDED

class AwardPeriodCreate(AwardPeriodBase):
    pass

class AwardPeriodUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    year: Optional[int] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    submission_deadline: Optional[datetime] = None
    decision_file_url: Optional[str] = None
    quotas: Optional[Dict[str, Any]] = None
    status: Optional[str] = None

class AwardPeriodResponse(AwardPeriodBase):
    id: UUID
    standards_count: Optional[int] = 0
    applications_count: Optional[int] = 0
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ==========================================
# Award Standard (Tiêu chuẩn 5 Tốt)
# ==========================================
class AwardStandardBase(BaseModel):
    period_id: Optional[UUID] = None
    criteria_name: str # "1. Đạo đức tốt", "2. Học tập tốt", "3. Thể lực tốt", "4. Tình nguyện tốt", "5. Hội nhập tốt"
    title: str
    evidence_requirement: Optional[str] = None
    document_reference: Optional[str] = None
    rule_type: str = "REQUIRED" # REQUIRED, GROUP_SELECT
    group_code: Optional[str] = None
    group_name: Optional[str] = None
    min_select_count: int = 1
    order_num: int = 0

class AwardStandardCreate(AwardStandardBase):
    pass

class AwardStandardUpdate(BaseModel):
    criteria_name: Optional[str] = None
    title: Optional[str] = None
    evidence_requirement: Optional[str] = None
    document_reference: Optional[str] = None
    rule_type: Optional[str] = None
    group_code: Optional[str] = None
    group_name: Optional[str] = None
    min_select_count: Optional[int] = None
    order_num: Optional[int] = None

class AwardStandardResponse(AwardStandardBase):
    id: UUID

    class Config:
        from_attributes = True

# ==========================================
# Award Application Item (Minh chứng từng tiêu chuẩn)
# ==========================================
class EvidenceFileItem(BaseModel):
    name: str
    url: str

class AwardApplicationItemBase(BaseModel):
    standard_id: Optional[UUID] = None
    is_selected: bool = False
    explanation: Optional[str] = None
    evidence_files: Optional[List[Dict[str, Any]]] = []
    eval_status: Optional[str] = None # PASSED, FAILED, null
    eval_note: Optional[str] = None
    is_temp_saved: bool = False

class AwardApplicationItemCreate(AwardApplicationItemBase):
    pass

class AwardApplicationItemResponse(AwardApplicationItemBase):
    id: UUID
    application_id: UUID
    standard: Optional[AwardStandardResponse] = None

    class Config:
        from_attributes = True

# ==========================================
# Award Approval History (Lịch sử xét duyệt)
# ==========================================
class AwardApprovalHistoryResponse(BaseModel):
    id: UUID
    application_id: UUID
    action: str
    from_status: Optional[str] = None
    to_status: Optional[str] = None
    actor_id: Optional[UUID] = None
    actor_name: Optional[str] = None
    note: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ==========================================
# Award Application (Hồ sơ xét chọn SV5T)
# ==========================================
class AwardApplicationBase(BaseModel):
    period_id: Optional[UUID] = None
    organization_id: Optional[UUID] = None
    target_type: str = "INDIVIDUAL" # INDIVIDUAL, COLLECTIVE
    
    # Thông tin cá nhân
    full_name: str
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    cccd: Optional[str] = None
    ethnicity: Optional[str] = None
    religion: Optional[str] = None

    # Thông tin học tập
    student_code: Optional[str] = None
    academic_year_num: Optional[int] = None
    school_name: Optional[str] = None
    faculty_name: Optional[str] = None
    class_name: Optional[str] = None
    education_level: Optional[str] = None
    gpa: Optional[float] = None
    training_score: Optional[int] = None

    # Đoàn - Hội & Liên hệ
    union_position: Optional[str] = None
    political_status: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None

    # Thành tích & Cam kết
    achievement_summary: Optional[str] = None
    legal_commitment: bool = False

class AwardApplicationCreate(AwardApplicationBase):
    items: Optional[List[AwardApplicationItemCreate]] = []
    is_draft: bool = False

class AwardApplicationUpdate(BaseModel):
    period_id: Optional[UUID] = None
    organization_id: Optional[UUID] = None
    target_type: Optional[str] = None
    
    full_name: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    cccd: Optional[str] = None
    ethnicity: Optional[str] = None
    religion: Optional[str] = None

    student_code: Optional[str] = None
    academic_year_num: Optional[int] = None
    school_name: Optional[str] = None
    faculty_name: Optional[str] = None
    class_name: Optional[str] = None
    education_level: Optional[str] = None
    gpa: Optional[float] = None
    training_score: Optional[int] = None

    union_position: Optional[str] = None
    political_status: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None

    achievement_summary: Optional[str] = None
    legal_commitment: Optional[bool] = None

    items: Optional[List[AwardApplicationItemCreate]] = None
    is_draft: bool = False

class AwardApplicationResponse(AwardApplicationBase):
    id: UUID
    application_code: Optional[str] = None
    status: str
    is_late_submission: bool = False
    created_by_id: Optional[UUID] = None
    user_id: Optional[UUID] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    period_code: Optional[str] = None
    period_name: Optional[str] = None
    organization_name: Optional[str] = None
    creator_name: Optional[str] = None

    # Extended items and histories
    items: Optional[List[AwardApplicationItemResponse]] = []
    histories: Optional[List[AwardApprovalHistoryResponse]] = []

    # Compatibility fields with legacy AwardResponse
    award_name: Optional[str] = "Danh hiệu Sinh viên 5 Tốt"
    student_id: Optional[str] = None
    university: Optional[str] = None
    points: Optional[int] = 0
    decision_number: Optional[str] = None
    awarded_date: Optional[date] = None

    class Config:
        from_attributes = True

# ==========================================
# Action Requests (Grading, Conclude, Leader Decision, Return)
# ==========================================
class AwardEvaluateItem(BaseModel):
    item_id: Optional[UUID] = None
    standard_id: Optional[UUID] = None
    eval_status: Optional[str] = None # "PASSED", "FAILED", null
    eval_note: Optional[str] = None

class AwardEvaluateRequest(BaseModel):
    items: List[AwardEvaluateItem]
    is_temp_save: bool = True # Lưu tạm vs chốt

class AwardConcludeRequest(BaseModel):
    conclusion: str # "QUALIFIED" hoặc "RETURN_TO_SCHOOL"
    reason: Optional[str] = None

class AwardDecisionRequest(BaseModel):
    decision: str # "APPROVED", "REJECTED", "RETURNED"
    note: Optional[str] = None

class AwardFeedbackRequest(BaseModel):
    note: str # Lý do góp ý chỉnh sửa / trả về

# ==========================================
# Legacy Award compatibility aliases
# ==========================================
class AwardBase(BaseModel):
    user_id: Optional[UUID] = None
    award_name: Optional[str] = "Danh hiệu Sinh viên 5 Tốt"
    description: Optional[str] = None
    status: Optional[str] = "DRAFT"
    decision_number: Optional[str] = None
    awarded_date: Optional[date] = None
    points: Optional[int] = 0
    assessment: Optional[dict] = None
    screening_results: Optional[dict] = None
    evidence_url: Optional[str] = None

class AwardCreate(AwardBase):
    pass

class AwardUpdate(BaseModel):
    user_id: Optional[UUID] = None
    award_name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    decision_number: Optional[str] = None
    awarded_date: Optional[date] = None
    points: Optional[int] = None
    assessment: Optional[dict] = None
    comments: Optional[str] = None

class AwardResponse(AwardApplicationResponse):
    pass

# ==========================================
# Dashboard Response
# ==========================================
class SV5TDashboardResponse(BaseModel):
    total_applications: int
    party_members_count: int
    union_members_count: int
    passed_count: int
    failed_count: int
    reviewing_count: int
    
    by_period: List[Dict[str, Any]]
    party_union_ratio: List[Dict[str, Any]]
    by_academic_year: List[Dict[str, Any]]
    by_education_level: List[Dict[str, Any]]
