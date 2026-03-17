from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_user
from app.models.core import User
from app.models.notifications import Notification
from app.schemas.notification_schemas import NotificationCreate, NotificationUpdate, NotificationResponse

router = APIRouter()

@router.post("/", response_model=NotificationResponse)
def create_notification(
    *,
    db: Session = Depends(get_db),
    notif_in: NotificationCreate,
):
    db_obj = Notification(**notif_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[NotificationResponse])
def read_notifications(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return db.query(Notification).offset(skip).limit(limit).all()

@router.get("/me", response_model=List[NotificationResponse])
def read_my_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Lấy danh sách thông báo của người dùng hiện tại.
    """
    return db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()

@router.get("/{notif_id}", response_model=NotificationResponse)
def read_notification(
    notif_id: UUID,
    db: Session = Depends(get_db)
):
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if notif is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notif

@router.put("/{notif_id}", response_model=NotificationResponse)
def update_notification(
    *,
    db: Session = Depends(get_db),
    notif_id: UUID,
    notif_in: NotificationUpdate,
):
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if notif is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    update_data = notif_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(notif, field, value)
        
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif

@router.delete("/{notif_id}")
def delete_notification(
    *,
    db: Session = Depends(get_db),
    notif_id: UUID,
):
    notif = db.query(Notification).filter(Notification.id == notif_id).first()
    if notif is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(notif)
    db.commit()
    return {"message": "Notification deleted successfully"}
