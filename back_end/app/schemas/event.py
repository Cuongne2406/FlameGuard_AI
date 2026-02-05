from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Dữ liệu gửi lên khi tạo sự kiện
class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: str
    start_time: datetime
    end_time: Optional[datetime] = None

# Dữ liệu trả về cho người dùng
class EventResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    location: str
    start_time: datetime
    end_time: Optional[datetime]
    creator_id: int

    class Config:
        from_attributes = True