from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import date
from app.models.awards import AwardStatus

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

class AwardBase(BaseModel):
    user_id: UUID
    award_name: str
    description: Optional[str] = None
    status: AwardStatus = AwardStatus.PENDING
    decision_number: Optional[str] = None
    awarded_date: Optional[date] = None
    points: int = 0
    assessment: Optional[dict] = None
    screening_results: Optional[dict] = None
    evidence_url: Optional[str] = None

class AwardCreate(AwardBase):
    pass

class AwardUpdate(BaseModel):
    user_id: Optional[UUID] = None
    award_name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[AwardStatus] = None
    decision_number: Optional[str] = None
    awarded_date: Optional[date] = None
    points: Optional[int] = None
    assessment: Optional[dict] = None

class AwardResponse(AwardBase):
    id: UUID
    # Thêm thông tin User để Frontend hiển thị
    student_id: Optional[str] = None
    full_name: Optional[str] = None
    university: Optional[str] = None

    class Config:
        from_attributes = True
