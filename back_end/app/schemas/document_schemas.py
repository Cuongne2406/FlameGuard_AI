from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.documents import DocumentStatus

class DigitalDocumentBase(BaseModel):
    user_id: UUID
    document_type: str
    purpose: Optional[str] = None
    status: DocumentStatus = DocumentStatus.PENDING
    file_url: Optional[str] = None
    rejection_reason: Optional[str] = None
    request_date: Optional[datetime] = None
    processed_date: Optional[datetime] = None

class DigitalDocumentCreate(BaseModel):
    user_id: Optional[UUID] = None
    document_type: str
    purpose: Optional[str] = None

class DigitalDocumentUpdate(BaseModel):
    status: Optional[DocumentStatus] = None
    file_url: Optional[str] = None
    rejection_reason: Optional[str] = None
    processed_date: Optional[datetime] = None

class DigitalDocumentResponse(DigitalDocumentBase):
    id: UUID

    class Config:
        from_attributes = True
