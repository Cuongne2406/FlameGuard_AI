from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.models.documents import DigitalDocument
from app.schemas.document_schemas import DigitalDocumentCreate, DigitalDocumentUpdate, DigitalDocumentResponse

router = APIRouter()

@router.post("/", response_model=DigitalDocumentResponse)
def create_document(
    *,
    db: Session = Depends(get_db),
    doc_in: DigitalDocumentCreate,
):
    db_obj = DigitalDocument(**doc_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[DigitalDocumentResponse])
def read_documents(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return db.query(DigitalDocument).offset(skip).limit(limit).all()

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
