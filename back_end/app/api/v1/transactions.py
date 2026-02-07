from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List
from app.api import deps
from app.models.notification import Notification
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

# --- SCHEMA VALIDATION ---
class NotificationCreate(BaseModel):
    title: str
    content: str
    type: str = "info" # urgent, info, success, warning
    target_audience: str = "ALL" # ALL, STUDENT, SUB_ADMIN
    status: str = "SENT"

# --- 1. API: TẠO THÔNG BÁO (Chỉ dành cho Admin/Sub-Admin) ---
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_notification(
    notif: NotificationCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if current_user.role not in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
        raise HTTPException(status_code=403, detail="Bạn không có quyền tạo thông báo")

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
    return {"message": "Tạo thông báo thành công", "id": new_notif.id}

# --- 2. API: LẤY THÔNG BÁO CỦA TÔI (Dành cho Sinh viên xem) ---
@router.get("/me")
def get_my_notifications(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Lọc thông báo: 
    # 1. Trạng thái phải là SENT (Đã gửi)
    # 2. Đối tượng là ALL, hoặc trùng Role với User, hoặc gửi đích danh cho user_id này
    notifications = db.query(Notification).filter(
        Notification.status == 'SENT',
        or_(
            Notification.target_audience == "ALL",
            Notification.target_audience == current_user.role,
            Notification.user_id == current_user.id
        )
    ).order_by(Notification.created_at.desc()).all()

    # Format lại dữ liệu để khớp với Frontend
    return [
        {
            "id": n.id,
            "title": n.title,
            "content": n.content,
            "type": n.type,
            "read": n.is_read, # Trả về field 'read' cho Frontend dễ dùng
            "time": n.created_at.isoformat(), # Dùng ISO format để Frontend tự convert "2 giờ trước"
            "created_at": n.created_at
        }
        for n in notifications
    ]

# --- 3. API: ĐÁNH DẤU ĐÃ ĐỌC ---
@router.put("/{id}/read")
def mark_as_read(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Tìm thông báo
    noti = db.query(Notification).filter(Notification.id == id).first()
    if not noti:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông báo")
    
    # Logic đơn giản: Cập nhật is_read
    noti.is_read = True
    db.commit()
    return {"message": "Đã đọc"}

# --- 4. API: QUẢN LÝ TẤT CẢ (Chỉ dành cho Admin) ---
@router.get("/all")
def get_all_notifications(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if current_user.role not in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập kho lưu trữ")
        
    return db.query(Notification).order_by(Notification.created_at.desc()).all()

# --- 5. API: XÓA THÔNG BÁO ---
@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    if current_user.role not in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
        raise HTTPException(status_code=403, detail="Không có quyền xóa")

    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if notif:
        db.delete(notif)
        db.commit()
    return None