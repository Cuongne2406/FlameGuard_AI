from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.documents import DocumentStatus

class DigitalDocumentBase(BaseModel):
    user_id: UUID
    document_code: Optional[str] = None
    document_type: str
    title: Optional[str] = None
    purpose: Optional[str] = None
    status: DocumentStatus = DocumentStatus.PENDING
    is_public: bool = False
    file_url: Optional[str] = None
    rejection_reason: Optional[str] = None
    request_date: Optional[datetime] = None
    processed_date: Optional[datetime] = None

class DigitalDocumentCreate(BaseModel):
    user_id: Optional[UUID] = None
    document_code: Optional[str] = None
    document_type: str
    title: Optional[str] = None
    purpose: Optional[str] = None
    is_public: bool = False

class DigitalDocumentUpdate(BaseModel):
    document_code: Optional[str] = None
    document_type: Optional[str] = None
    title: Optional[str] = None
    purpose: Optional[str] = None
    is_public: Optional[bool] = None
    status: Optional[DocumentStatus] = None
    file_url: Optional[str] = None
    rejection_reason: Optional[str] = None
    processed_date: Optional[datetime] = None

class DigitalDocumentResponse(DigitalDocumentBase):
    id: UUID

    class Config:
        from_attributes = True
