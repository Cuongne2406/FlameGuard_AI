from app.api.deps import get_current_user
from app.models.user import User
from app.models.participation import Participation
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.event import Event
from app.schemas.event import EventCreate, EventResponse

router = APIRouter()

# 1. API: Tạo sự kiện mới (Đã cập nhật để nhận Status và Max Participants)
@router.post("/", response_model=EventResponse)
def create_event(
    event_in: EventCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Kiểm tra quyền: Chỉ Admin/Sub-Admin mới được tạo
    if current_user.role not in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
         raise HTTPException(status_code=403, detail="Bạn không có quyền tạo sự kiện")

    # Lưu dữ liệu từ Frontend vào Database
    new_event = Event(
        title=event_in.title,
        description=event_in.description,
        location=event_in.location,
        start_time=event_in.start_time,
        end_time=event_in.end_time,
        
        # --- [MỚI] Thêm 2 trường này để khớp với Modal Frontend ---
        max_participants=event_in.max_participants,
        status=event_in.status, # UPCOMING, ONGOING, etc.
        # ---------------------------------------------------------
        **event_in.dict(),
        creator_id=current_user.id
    )
    
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

# 2. API: Lấy danh sách sự kiện (Đã thêm Lọc Trạng Thái & Sắp xếp)
@router.get("/", response_model=List[EventResponse])
def get_events(
    db: Session = Depends(get_db),
    # Thêm tham số lọc trạng thái (status)
    status: Optional[str] = Query(None, description="Lọc theo trạng thái (UPCOMING, ONGOING...)"),
    search: Optional[str] = Query(None, description="Nhập tên sự kiện cần tìm")
):
    # Bắt đầu truy vấn
    query = db.query(Event)
    
    # 1. Logic Lọc theo Trạng thái (Quan trọng cho Dropdown)
    if status and status != "ALL":
        query = query.filter(Event.status == status)

    # 2. Logic Tìm kiếm
    if search:
        query = query.filter(Event.title.ilike(f"%{search}%"))
    
    # 3. Sắp xếp: Sự kiện mới nhất (hoặc sắp diễn ra) lên đầu
    # Sắp giảm dần theo start_time
    return query.order_by(Event.start_time.desc()).all()

# 3. API: Lấy chi tiết (Giữ nguyên)
@router.get("/{event_id}", response_model=EventResponse)
def get_event_detail(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Không tìm thấy sự kiện này")
    return event

# 4. API: Xóa sự kiện (Giữ nguyên)
@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Sự kiện không tồn tại")
    
    db.delete(event)
    db.commit()
    return {"message": "Đã xóa sự kiện thành công"}

# 5. API: Đăng ký tham gia (Giữ nguyên logic chuẩn)
@router.post("/{event_id}/join")
def join_event(
    event_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_id = current_user.id 
    
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Sự kiện không tồn tại")

    existing_join = db.query(Participation).filter(
        Participation.user_id == user_id,
        Participation.event_id == event_id
    ).first()
    
    if existing_join:
        raise HTTPException(status_code=400, detail="Bạn đã điểm danh sự kiện này rồi!")

    new_participation = Participation(
        user_id=user_id,
        event_id=event_id,
        check_in_time=datetime.utcnow()
    )
    
    db.add(new_participation)
    db.commit()
    
    return {"message": f"Điểm danh thành công sự kiện: {event.title}"}

# API: Xem danh sách tham gia (Giữ nguyên)
@router.get("/{event_id}/participants")
def get_event_participants(
    event_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Sự kiện không tồn tại")
    
    results = db.query(User.mssv, User.full_name, Participation.check_in_time)\
        .join(Participation, User.id == Participation.user_id)\
        .filter(Participation.event_id == event_id)\
        .all()
    
    return [
        {
            "mssv": r.mssv, 
            "name": r.full_name, 
            "check_in": r.check_in_time
        } 
        for r in results
    ]