from sqlalchemy.orm import Session
from uuid import UUID
from app.models.notifications import Notification
from app.schemas.notification_schemas import NotificationCreate, NotificationUpdate

async def send_realtime_notification(notification: Notification, push_token: str = None):
    # 1. Broadcast to Web (via WebSocket)
    from app.core.websocket import manager
    
    notification_data = {
        "id": str(notification.id),
        "user_id": str(notification.user_id),
        "title": notification.title,
        "message": notification.message,
        "is_read": notification.is_read,
        "created_at": notification.created_at.isoformat() if notification.created_at else None
    }
    
    # Send WebSocket
    await manager.send_personal_message(notification_data, notification.user_id)
    
    # 2. Send Mobile Push Notification (via Expo)
    if push_token:
        import httpx
        url = "https://exp.host/--/api/v2/push/send"
        payload = {
            "to": push_token,
            "sound": "default",
            "title": notification.title,
            "body": notification.message,
            "data": notification_data
        }
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, headers={"Content-Type": "application/json"})
                if response.status_code == 200:
                    print(f"Expo Push sent successfully to {push_token}")
                else:
                    print(f"Failed to send Expo Push: {response.text}")
        except Exception as e:
            print(f"Error sending Expo Push: {e}")

def create_notification(db: Session, notification_in: NotificationCreate):
    db_notification = Notification(**notification_in.dict())
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    
    # Synchronously fetch push_token of the user
    from app.models.core import User
    user = db.query(User).filter(User.id == db_notification.user_id).first()
    push_token = user.push_token if user else None
    
    # Schedule the async push in the event loop
    try:
        import asyncio
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = None
            
        if loop and loop.is_running():
            loop.create_task(send_realtime_notification(db_notification, push_token))
        else:
            # Fallback for sync environments or scripts
            asyncio.run(send_realtime_notification(db_notification, push_token))
    except Exception as e:
        print(f"Error scheduling real-time notification: {e}")
        
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
