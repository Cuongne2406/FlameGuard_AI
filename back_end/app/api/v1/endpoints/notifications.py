from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.schemas.notification_schemas import NotificationResponse, NotificationUpdate
from app.services import notification_service
from app.models.core import User

router = APIRouter()

@router.get("/me", response_model=List[NotificationResponse])
def get_my_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = 100,
):
    return notification_service.get_user_notifications(db=db, user_id=current_user.id, skip=skip, limit=limit)

@router.put("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(
    notification_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    # Verify notification belongs to user
    notification = notification_service.get_notification(db, notification_id)
    if not notification or notification.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    return notification_service.mark_as_read(db=db, notification_id=notification_id)

@router.post("/read-all")
def mark_all_notifications_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    notification_service.mark_all_as_read(db=db, user_id=current_user.id)
    return {"status": "success"}
