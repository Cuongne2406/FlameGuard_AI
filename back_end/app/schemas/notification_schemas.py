from typing import Optional, List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class NotificationBase(BaseModel):
    title: str
    message: str
    is_read: bool = False

class NotificationCreate(NotificationBase):
    user_id: UUID

class NotificationUpdate(BaseModel):
    is_read: bool

class NotificationResponse(NotificationBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
