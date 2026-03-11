from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.models.settings import SystemSetting
from app.schemas.setting_schemas import SystemSettingCreate, SystemSettingUpdate, SystemSettingResponse

router = APIRouter()

@router.post("/", response_model=SystemSettingResponse)
def create_setting(
    *,
    db: Session = Depends(get_db),
    setting_in: SystemSettingCreate,
):
    db_obj = SystemSetting(**setting_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[SystemSettingResponse])
def read_settings(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return db.query(SystemSetting).offset(skip).limit(limit).all()

@router.get("/{setting_id}", response_model=SystemSettingResponse)
def read_setting(
    setting_id: UUID,
    db: Session = Depends(get_db)
):
    setting = db.query(SystemSetting).filter(SystemSetting.id == setting_id).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    return setting

@router.put("/{setting_id}", response_model=SystemSettingResponse)
def update_setting(
    *,
    db: Session = Depends(get_db),
    setting_id: UUID,
    setting_in: SystemSettingUpdate,
):
    setting = db.query(SystemSetting).filter(SystemSetting.id == setting_id).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    
    update_data = setting_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(setting, field, value)
        
    db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting

@router.delete("/{setting_id}")
def delete_setting(
    *,
    db: Session = Depends(get_db),
    setting_id: UUID,
):
    setting = db.query(SystemSetting).filter(SystemSetting.id == setting_id).first()
    if not setting:
        raise HTTPException(status_code=404, detail="Setting not found")
    db.delete(setting)
    db.commit()
    return {"message": "Setting deleted successfully"}
