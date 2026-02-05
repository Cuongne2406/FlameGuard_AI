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

# 1. API: Tạo sự kiện mới
@router.post("/", response_model=EventResponse)
def create_event(
    event_in: EventCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # <--- Bắt buộc phải đăng nhập
):
    # Kiểm tra quyền: Chỉ Admin mới được tạo
    if current_user.role != "SUPER_ADMIN" and current_user.role != "ADMIN":
         raise HTTPException(status_code=403, detail="Bạn không có quyền tạo sự kiện")

    new_event = Event(
        # ... (các dòng copy dữ liệu giữ nguyên) ...
        title=event_in.title,
        description=event_in.description,
        location=event_in.location,
        start_time=event_in.start_time,
        end_time=event_in.end_time,
        creator_id=current_user.id # <--- LẤY ID THẬT CỦA NGƯỜI DÙNG
    )
    # ... (phần add/commit giữ nguyên) ...
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

# 2. API: Lấy danh sách sự kiện (Tích hợp Tìm kiếm)
# Hàm này sẽ thay thế hoàn toàn hàm get cũ
@router.get("/", response_model=List[EventResponse])
def get_events(
    db: Session = Depends(get_db),
    # Tham số search là tùy chọn
    search: Optional[str] = Query(None, description="Nhập tên sự kiện cần tìm (VD: Xuân)")
):
    # Bắt đầu câu truy vấn
    query = db.query(Event)
    
    # Nếu có từ khóa tìm kiếm thì lọc
    if search:
        # Dùng ilike để tìm không phân biệt hoa thường
        print(f"DEBUG: Đang tìm kiếm với từ khóa: {search}") 
        query = query.filter(Event.title.ilike(f"%{search}%"))
    
    # Trả về kết quả (đã lọc hoặc toàn bộ)
    return query.all()

# 3. API: Lấy chi tiết một sự kiện theo ID
@router.get("/{event_id}", response_model=EventResponse)
def get_event_detail(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Không tìm thấy sự kiện này")
    
    return event

# 4. API: Xóa sự kiện
@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Sự kiện không tồn tại")
    
    db.delete(event)
    db.commit()
    
    return {"message": "Đã xóa sự kiện thành công"}

# 5. API: Đăng ký tham gia sự kiện (Check-in)
@router.post("/{event_id}/join")
def join_event(
    event_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # 1. Yêu cầu đăng nhập và lấy user hiện tại
):
    # 2. Sử dụng ID thật từ token thay vì số 1 cứng nhắc
    user_id = current_user.id 
    
    # 1. Kiểm tra sự kiện có tồn tại không
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Sự kiện không tồn tại")

    # 2. Kiểm tra xem user này đã tham gia sự kiện này chưa
    existing_join = db.query(Participation).filter(
        Participation.user_id == user_id,
        Participation.event_id == event_id
    ).first()
    
    if existing_join:
        raise HTTPException(status_code=400, detail="Bạn đã điểm danh sự kiện này rồi!")

    # 3. Ghi danh với thông tin thật
    new_participation = Participation(
        user_id=user_id,
        event_id=event_id,
        check_in_time=datetime.utcnow()
    )
    
    db.add(new_participation)
    db.commit()
    
    return {"message": f"Điểm danh thành công sự kiện: {event.title}"}



# API: Xem danh sách sinh viên tham gia một sự kiện
@router.get("/{event_id}/participants")
def get_event_participants(
    event_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # Chỉ user đăng nhập mới xem được
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Sự kiện không tồn tại")
    
    # Dùng relationship để lấy danh sách (cần logic hơi nâng cao xíu để lấy tên User)
    # Cách đơn giản nhất: Query bảng Participation join với User
    results = db.query(User.mssv, User.full_name, Participation.check_in_time)\
        .join(Participation, User.id == Participation.user_id)\
        .filter(Participation.event_id == event_id)\
        .all()
    
    # Format lại dữ liệu trả về cho đẹp
    return [
        {
            "mssv": r.mssv, 
            "name": r.full_name, 
            "check_in": r.check_in_time
        } 
        for r in results
    ]