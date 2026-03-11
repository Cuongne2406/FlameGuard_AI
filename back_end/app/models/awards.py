import uuid
import enum
from sqlalchemy import Column, String, ForeignKey, Date, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base

class AwardStatus(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class Award(Base):
    __tablename__ = "awards"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    award_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(AwardStatus), default=AwardStatus.PENDING)
    decision_number = Column(String, nullable=True)
    awarded_date = Column(Date, nullable=True)

    user = relationship("User", backref="awards")
