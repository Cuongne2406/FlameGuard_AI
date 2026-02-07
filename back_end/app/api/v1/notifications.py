from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from app.api.deps import get_db, get_current_user
from app.models.notification import Notification
from app.models.user import User

router = APIRouter()

class NotificationCreate(BaseModel):
    title: str
    content: str
    type: str = "info"
    target_audience: str = "ALL"
    status: str = "SENT" # Mặc định thông báo là gửi luôn, nhưng có thể nhận "DRAFT"

@router.post("/", status_code=201)
def create_notification(
    notif: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
        raise HTTPException(status_code=403, detail="Không đủ quyền hạn")

    new_notif = Notification(
        title=notif.title,
        content=notif.content,
        type=notif.type,
        target_audience=notif.target_audience,
        status=notif.status, # Lưu trạng thái (SENT hoặc DRAFT)
        creator_id=current_user.id
    )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)
    return {"message": "Thành công!", "id": new_notif.id}

@router.get("/me")
def get_my_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Logic: Chỉ hiển thị những tin ĐÃ GỬI (SENT) cho người dùng cuối
    # Draft chỉ Admin mới thấy (nhưng ở API quản lý khác, API /me này dùng cho cái Chuông)
    
    return db.query(Notification).filter(
        (Notification.status == 'SENT') & # <--- QUAN TRỌNG: Chỉ lấy tin đã gửi
        (
            (Notification.target_audience == "ALL") | 
            (Notification.target_audience == current_user.role)
        )
    ).order_by(Notification.created_at.desc()).all()


@router.get("/all")
def get_all_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Chỉ Admin/Sub-Admin mới được vào kho quản lý này
    if current_user.role not in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
        raise HTTPException(status_code=403, detail="Không có quyền")
        
    return db.query(Notification).order_by(Notification.created_at.desc()).all()


# API Xóa thông báo (DELETE)
@router.delete("/{notification_id}", status_code=204)
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Kiểm tra quyền Admin
    if current_user.role not in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
        raise HTTPException(status_code=403, detail="Không đủ quyền hạn")

    # 2. Tìm thông báo cần xóa
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông báo")

    # 3. Xóa và lưu
    db.delete(notif)
    db.commit()
    return None

@router.get("/me", response_model=List[dict]) # Trả về dict để ta tùy biến tên trường
def get_my_notifications(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Lấy các thông báo dành cho tất cả mọi người (ALL) và đã ở trạng thái SENT
    notifications = db.query(Notification)\
        .filter(Notification.status == "SENT")\
        .order_by(Notification.created_at.desc())\
        .limit(5)\
        .all()
    
    # Chuyển đổi dữ liệu để khớp với Frontend (type -> category)
    result = []
    for n in notifications:
        result.append({
            "id": n.id,
            "title": n.title,
            "content": n.content,
            "category": n.type, # React mong đợi 'category'
            "time": n.created_at.strftime("%H:%M %d/%m"),
            "isNew": True # Bạn có thể thêm logic so sánh thời gian ở đây
        })
    
    return result