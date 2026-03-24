import uuid
import enum
from sqlalchemy import Column, String, ForeignKey, Date, Enum, Text, Integer, JSON, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base

class AwardStatus(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class CriteriaType(enum.Enum):
    MIN_GPA = "MIN_GPA"
    MIN_TRAINING_SCORE = "MIN_TRAINING_SCORE"
    MIN_EVENTS_ATTENDED = "MIN_EVENTS_ATTENDED"
    REQUIRED_EVENT_CATEGORY = "REQUIRED_EVENT_CATEGORY"
    CUSTOM = "CUSTOM"

class AwardCriteria(Base):
    __tablename__ = "award_criteria"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False) # Ví dụ: "Điểm rèn luyện > 80"
    type = Column(Enum(CriteriaType), nullable=False)
    value = Column(String, nullable=False) # Lưu giá trị ngưỡng (Vd: "80", "3.2")
    is_required = Column(Boolean, default=True)
    description = Column(Text, nullable=True)

class Award(Base):
    __tablename__ = "awards"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    award_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(AwardStatus), default=AwardStatus.PENDING)
    decision_number = Column(String, nullable=True)
    awarded_date = Column(Date, nullable=True)
    points = Column(Integer, default=0)
    assessment = Column(JSON, nullable=True)
    screening_results = Column(JSON, nullable=True) # Lưu KQ sơ lọc: {"passed": true, "details": [...]}
    evidence_url = Column(String, nullable=True) # Link minh chứng (PDF/Ảnh)

    user = relationship("User", backref="awards")
