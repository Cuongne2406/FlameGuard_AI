from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from app.api import deps
from app.models.notification import Notification
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

# Schema để Admin gửi dữ liệu lên
class NotificationCreate(BaseModel):
    title: str
    content: str
    type: str = "info"
    target_audience: str = "ALL"
    status: str = "SENT"

# --- 1. ADMIN POST: Gửi thông báo ---
@router.post("/", status_code=201)
def create_notification(
    notif: NotificationCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if current_user.role not in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
        raise HTTPException(status_code=403, detail="Không đủ quyền hạn")

    new_notif = Notification(
        title=notif.title,
        content=notif.content,
        type=notif.type,
        target_audience=notif.target_audience,
        status=notif.status,
        creator_id=current_user.id
    )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)
    return {"message": "Thành công!", "id": new_notif.id}

# --- 2. USER GET: Lấy thông báo của tôi (Đã sửa để hết trắng trang) ---
@router.get("/me")
def get_my_notifications(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Logic lọc: Chỉ lấy tin SENT và đúng đối tượng nhận
    notifications = db.query(Notification).filter(
        Notification.status == "SENT",
        or_(
            Notification.target_audience == "ALL",
            Notification.target_audience == current_user.role,
            Notification.user_id == current_user.id
        )
    ).order_by(Notification.created_at.desc()).limit(20).all()
    
    # Trả về các trường chính xác như User Frontend mong đợi
    return [
        {
            "id": n.id,
            "title": n.title,
            "content": n.content,
            "type": n.type,         # Khớp với getColor(item.type)
            "is_read": n.is_read,   # Khớp với logic check tin mới
            "created_at": n.created_at.isoformat() # Dùng ISO để Frontend không bị Invalid Date
        }
        for n in notifications
    ]

# --- 3. ADMIN GET ALL & DELETE: Quản lý (Giữ nguyên) ---
@router.get("/all")
def get_all_notifications(db: Session = Depends(deps.get_db), current_user = Depends(deps.get_current_user)):
    if current_user.role not in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
        raise HTTPException(status_code=403, detail="Không có quyền")
    return db.query(Notification).order_by(Notification.created_at.desc()).all()

@router.delete("/{notification_id}", status_code=204)
def delete_notification(notification_id: int, db: Session = Depends(deps.get_db), current_user = Depends(deps.get_current_user)):
    if current_user.role not in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
        raise HTTPException(status_code=403, detail="Không có quyền")
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if notif:
        db.delete(notif)
        db.commit()
    return None