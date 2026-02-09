from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Class Gốc (Chứa tất cả các trường chung)
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    location: str
    start_time: datetime
    end_time: Optional[datetime] = None
    max_participants: int = 100
    status: str = "UPCOMING" 
    image_url: Optional[str] = None

# Dữ liệu gửi lên khi tạo 
class EventCreate(EventBase):
    pass 
    # 'pass' nghĩa là: "Lấy y nguyên của cha (EventBase), không cần thêm gì"

# Dữ liệu trả về cho người dùng
class EventResponse(EventBase):
    id: int
    creator_id: int
    
    class Config:
        from_attributes = True