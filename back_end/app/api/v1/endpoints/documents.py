from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import cloudinary
import cloudinary.uploader

from app.api.deps import get_db, get_current_active_user, get_current_active_admin
from app.models.documents import DigitalDocument
from app.schemas.document_schemas import DigitalDocumentCreate, DigitalDocumentUpdate, DigitalDocumentResponse
from app.core.config import settings
from app.utils.file_validator import verify_document_magic_bytes

# Init Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

router = APIRouter()

@router.post("/upload-file")
async def upload_document_file(
    file: UploadFile = File(...),
    current_user = Depends(get_current_active_user)
):
    """
    Upload a document file (PDF, DOCX) to Cloudinary and return the secure URL.
    """
    ALLOWED_TYPES = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Chỉ chấp nhận file PDF hoặc DOCX")

    MAX_SIZE = 20 * 1024 * 1024  # 20 MB
    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File quá lớn. Tối đa 20MB")

    # Kiểm tra Magic Bytes
    if not verify_document_magic_bytes(contents):
        raise HTTPException(status_code=400, detail="Tệp tin tài liệu không hợp lệ (Không đúng định dạng PDF/DOC/DOCX)")

    try:
        result = cloudinary.uploader.upload(
            contents,
            resource_type="raw",
            folder="dyus_documents",
            public_id=f"{file.filename.rsplit('.', 1)[0]}_{current_user.id}",
            use_filename=True,
            unique_filename=True,
            overwrite=False,
        )
        return {
            "file_url": result["secure_url"],
            "public_id": result["public_id"],
            "format": result.get("format", ""),
            "bytes": result.get("bytes", 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload thất bại: {str(e)}")

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
        from sqlalchemy import or_
        query = query.filter(or_(DigitalDocument.is_public == True, DigitalDocument.user_id == current_user.id))
        
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
        query = query.filter(DigitalDocument.is_public == True)
    
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
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    doc = db.query(DigitalDocument).filter(DigitalDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if not is_admin and not doc.is_public and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bạn không có quyền truy cập tài liệu này")
        
    return doc

@router.put("/{doc_id}", response_model=DigitalDocumentResponse)
def update_document(
    *,
    db: Session = Depends(get_db),
    doc_id: UUID,
    doc_in: DigitalDocumentUpdate,
    current_user = Depends(get_current_active_user)
):
    doc = db.query(DigitalDocument).filter(DigitalDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if not is_admin and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bạn không có quyền chỉnh sửa tài liệu này")
    
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
    current_user = Depends(get_current_active_user)
):
    doc = db.query(DigitalDocument).filter(DigitalDocument.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if not is_admin and doc.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bạn không có quyền xóa tài liệu này")
        
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully"}
