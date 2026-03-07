import uuid
from sqlalchemy import Column, String, Integer, Enum, ForeignKey, Date, DateTime, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base
import enum

class CampaignStatus(enum.Enum):
    PLANNING = "Planning"
    ONGOING = "Ongoing"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class EventStatus(enum.Enum):
    DRAFT = "Draft"
    PUBLISHED = "Published"
    LIVE = "Live"
    ENDED = "Ended"

class EventRegistrationStatus(enum.Enum):
    REGISTERED = "Registered"
    ATTENDED = "Attended"
    CANCELLED = "Cancelled"

class Campaign(Base):
    __tablename__ = "campaigns"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False)
    academic_term_id = Column(UUID(as_uuid=True), ForeignKey("academic_terms.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(Enum(CampaignStatus), default=CampaignStatus.PLANNING)
    total_budget_allocated = Column(Numeric(15, 2), default=0)
    
    organization = relationship("Organization", back_populates="campaigns")
    academic_term = relationship("AcademicTerm", back_populates="campaigns")
    events = relationship("Event", back_populates="campaign")

class Event(Base):
    __tablename__ = "events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=True)
    name = Column(String, nullable=False)
    location = Column(String)
    start_time = Column(DateTime(timezone=True))
    end_time = Column(DateTime(timezone=True))
    capacity = Column(Integer)
    status = Column(Enum(EventStatus), default=EventStatus.DRAFT)
    
    campaign = relationship("Campaign", back_populates="events")
    registrations = relationship("EventRegistration", back_populates="event")
    fund_requests = relationship("FundRequest", back_populates="event")
    ai_predictions = relationship("AIPrediction", back_populates="event")

class EventRegistration(Base):
    __tablename__ = "event_registrations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    check_in_time = Column(DateTime(timezone=True), nullable=True)
    status = Column(Enum(EventRegistrationStatus), default=EventRegistrationStatus.REGISTERED)
    
    event = relationship("Event", back_populates="registrations")
    user = relationship("User", back_populates="event_registrations")
