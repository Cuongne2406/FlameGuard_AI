from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class NotificationBase(BaseModel):
    user_id: UUID
    title: str
    message: str
    is_read: bool = False
    created_at: Optional[datetime] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None

class NotificationResponse(NotificationBase):
    id: UUID

    class Config:
        from_attributes = True
