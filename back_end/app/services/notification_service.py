from sqlalchemy.orm import Session
from uuid import UUID
from app.models.notifications import Notification
from app.schemas.notification_schemas import NotificationCreate, NotificationUpdate

def create_notification(db: Session, notification_in: NotificationCreate):
    db_notification = Notification(**notification_in.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

def get_notification(db: Session, notification_id: UUID):
    return db.query(Notification).filter(Notification.id == notification_id).first()

def get_user_notifications(db: Session, user_id: UUID, skip: int = 0, limit: int = 100):
    return db.query(Notification).filter(Notification.user_id == user_id).order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()

def mark_as_read(db: Session, notification_id: UUID):
    db_notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if db_notification:
        db_notification.is_read = True
        db.commit()
        db.refresh(db_notification)
    return db_notification

def mark_all_as_read(db: Session, user_id: UUID):
    db.query(Notification).filter(Notification.user_id == user_id, Notification.is_read == False).update({"is_read": True})
    db.commit()
    return True
