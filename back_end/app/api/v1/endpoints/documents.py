from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_user
from app.models.documents import DigitalDocument
from app.schemas.document_schemas import DigitalDocumentCreate, DigitalDocumentUpdate, DigitalDocumentResponse

router = APIRouter()

@router.post("/", response_model=DigitalDocumentResponse)
def create_document(
    *,
    db: Session = Depends(get_db),
    doc_in: DigitalDocumentCreate,
    current_user = Depends(get_current_active_user),
):
    doc_data = doc_in.model_dump()
    if not doc_data.get("user_id"):
        doc_data["user_id"] = current_user.id
    db_obj = DigitalDocument(**doc_data)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[DigitalDocumentResponse])
def read_documents(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """
    Get documents. Admins see everything, users see their own.
    """
    query = db.query(DigitalDocument)
    # Check if user has administrative role (Simple check: if not a regular student)
    # Note: In a real app, use permission-based checks.
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if not is_admin:
        query = query.filter(DigitalDocument.user_id == current_user.id)
        
    return query.order_by(DigitalDocument.request_date.desc()).offset(skip).limit(limit).all()

@router.get("/stats")
def get_document_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """
    Get stats for documents.
    """
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    query = db.query(DigitalDocument)
    if not is_admin:
        query = query.filter(DigitalDocument.user_id == current_user.id)
    
    incoming = query.filter(DigitalDocument.status == "APPROVED").count()
    pending = query.filter(DigitalDocument.status == "PENDING").count()
    return {
        "incoming": incoming,
        "outgoing": 0, # Placeholder for future logic
        "pending": pending
    }

@router.get("/{doc_id}", response_model=DigitalDocumentResponse)
def read_document(
    doc_id: UUID,
    db: Session = Depends(get_db)
):
    doc = db.query(DigitalDocument).filter(DigitalDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.put("/{doc_id}", response_model=DigitalDocumentResponse)
def update_document(
    *,
    db: Session = Depends(get_db),
    doc_id: UUID,
    doc_in: DigitalDocumentUpdate,
):
    doc = db.query(DigitalDocument).filter(DigitalDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    update_data = doc_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(doc, field, value)
        
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

@router.delete("/{doc_id}")
def delete_document(
    *,
    db: Session = Depends(get_db),
    doc_id: UUID,
):
    doc = db.query(DigitalDocument).filter(DigitalDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}
