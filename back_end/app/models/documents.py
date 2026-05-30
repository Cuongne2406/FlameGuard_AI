import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, ForeignKey, DateTime, Enum, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base

class DocumentStatus(enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class DigitalDocument(Base):
    __tablename__ = "digital_documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    document_code = Column(String, nullable=True) # Số hiệu văn bản
    document_type = Column(String, nullable=False)
    title = Column(String, nullable=True) # Trích yếu
    purpose = Column(Text, nullable=True)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.PENDING)
    is_public = Column(Boolean, default=False)
    file_url = Column(String, nullable=True)
    rejection_reason = Column(String, nullable=True)
    request_date = Column(DateTime, default=datetime.utcnow)
    processed_date = Column(DateTime, nullable=True)

    user = relationship("User", backref="digital_documents")
