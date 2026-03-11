from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class SystemSettingBase(BaseModel):
    key: str
    value: str
    description: Optional[str] = None

class SystemSettingCreate(SystemSettingBase):
    pass

class SystemSettingUpdate(BaseModel):
    value: Optional[str] = None
    description: Optional[str] = None

class SystemSettingResponse(SystemSettingBase):
    id: UUID

    class Config:
        from_attributes = True
