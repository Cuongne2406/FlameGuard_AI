from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import date
from app.models.awards import AwardStatus

class AwardBase(BaseModel):
    user_id: UUID
    award_name: str
    description: Optional[str] = None
    status: AwardStatus = AwardStatus.PENDING
    decision_number: Optional[str] = None
    awarded_date: Optional[date] = None

class AwardCreate(AwardBase):
    pass

class AwardUpdate(BaseModel):
    user_id: Optional[UUID] = None
    award_name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[AwardStatus] = None
    decision_number: Optional[str] = None
    awarded_date: Optional[date] = None

class AwardResponse(AwardBase):
    id: UUID

    class Config:
        from_attributes = True
