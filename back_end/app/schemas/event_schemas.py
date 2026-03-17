from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import date, datetime
from enum import Enum
from decimal import Decimal

# ==========================================
# Enums from Models
# ==========================================
class CampaignStatusEnum(str, Enum):
    PLANNING = "PLANNING"
    ONGOING = "ONGOING"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class EventStatusEnum(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    LIVE = "LIVE"
    ENDED = "ENDED"

class EventRegistrationStatusEnum(str, Enum):
    REGISTERED = "REGISTERED"
    ATTENDED = "ATTENDED"
    CANCELLED = "CANCELLED"


# ==========================================
# Campaign Schemas
# ==========================================
class CampaignBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: CampaignStatusEnum = CampaignStatusEnum.PLANNING
    total_budget_allocated: Decimal = Decimal("0.00")

class CampaignCreate(CampaignBase):
    organization_id: UUID
    academic_term_id: UUID

class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[CampaignStatusEnum] = None
    total_budget_allocated: Optional[Decimal] = None
    organization_id: Optional[UUID] = None
    academic_term_id: Optional[UUID] = None

class CampaignResponse(CampaignBase):
    id: UUID
    organization_id: UUID
    academic_term_id: UUID
    organization_name: Optional[str] = None
    academic_term_name: Optional[str] = None

    class Config:
        from_attributes = True


# ==========================================
# Event Schemas
# ==========================================
class EventBase(BaseModel):
    name: str
    location: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    capacity: Optional[int] = None
    status: EventStatusEnum = EventStatusEnum.DRAFT

class EventCreate(EventBase):
    campaign_id: Optional[UUID] = None

class EventUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    capacity: Optional[int] = None
    status: Optional[EventStatusEnum] = None
    campaign_id: Optional[UUID] = None

class EventResponse(EventBase):
    id: UUID
    campaign_id: Optional[UUID] = None

    class Config:
        from_attributes = True


# ==========================================
# Event Registration Schemas
# ==========================================
class EventRegistrationBase(BaseModel):
    status: EventRegistrationStatusEnum = EventRegistrationStatusEnum.REGISTERED

class EventRegistrationCreate(EventRegistrationBase):
    event_id: UUID
    user_id: UUID

class EventRegistrationUpdate(BaseModel):
    status: Optional[EventRegistrationStatusEnum] = None
    check_in_time: Optional[datetime] = None

class EventRegistrationResponse(EventRegistrationBase):
    id: UUID
    event_id: UUID
    user_id: UUID
    check_in_time: Optional[datetime] = None

    class Config:
        from_attributes = True
