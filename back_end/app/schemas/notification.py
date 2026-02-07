from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificationResponse(BaseModel):
    id: int
    title: str
    content: str
    category: str # Ánh xạ từ field 'type' của Model
    status: str
    created_at: datetime

    class Config:
        from_attributes = True