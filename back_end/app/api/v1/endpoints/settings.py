from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_admin
from app.models.settings import SystemSetting
from app.schemas.setting_schemas import SystemSettingCreate, SystemSettingUpdate, SystemSettingResponse
from app.models.core import User

from app.services import ai_audit_service, cloudinary_service
from app.schemas.ai_audit_schemas import AuditLogCreate
from datetime import datetime
from app.utils.file_validator import verify_image_magic_bytes

router = APIRouter()

@router.post("/logo")
async def upload_system_logo(
    *,
    db: Session = Depends(get_db),
    file: UploadFile = File(...),
    current_admin: User = Depends(get_current_active_admin)
):
    # Kiểm tra Magic Bytes của ảnh logo tải lên
    contents = await file.read()
    await file.seek(0)
    if not verify_image_magic_bytes(contents):
        raise HTTPException(status_code=400, detail="Tệp tin hình ảnh không hợp lệ (Không đúng định dạng JPEG/PNG/GIF/WEBP)")

    result = cloudinary_service.upload_image(file.file, folder="system/logo")
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))
        
    logo_url = result.get("url")
    
    db_setting = db.query(SystemSetting).filter(SystemSetting.key == "SYSTEM_LOGO").first()
    if db_setting:
        db_setting.value = logo_url
    else:
        db_setting = SystemSetting(key="SYSTEM_LOGO", value=logo_url)
        db.add(db_setting)
        
    db.commit()
    
    ai_audit_service.create_system_audit_log(db, AuditLogCreate(
        action="UPDATE_LOGO",
        entity_type="SystemSetting",
        created_at=datetime.now()
    ))
    
    return {"url": logo_url}

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
    
    # Ghi nhật ký: Lưu cài đặt mới
    ai_audit_service.create_system_audit_log(db, AuditLogCreate(
        action="CREATE_SETTING",
        entity_type="SystemSetting",
        entity_id=db_obj.id,
        created_at=datetime.now()
    ))
    
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
    
    # Ghi nhật ký: Cập nhật cài đặt hệ thống
    ai_audit_service.create_system_audit_log(db, AuditLogCreate(
        action="UPDATE_SETTING",
        entity_type="SystemSetting",
        entity_id=setting.id,
        created_at=datetime.now()
    ))
    
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
    
    # Ghi nhật ký: Xóa cài đặt
    ai_audit_service.create_system_audit_log(db, AuditLogCreate(
        action="DELETE_SETTING",
        entity_type="SystemSetting",
        entity_id=setting_id,
        created_at=datetime.now()
    ))
    
    return {"message": "Setting deleted successfully"}

@router.put("/batch/update")
def batch_update_settings(
    *,
    db: Session = Depends(get_db),
    settings_in: dict
):
    """
    Cập nhật hoặc tạo mới hàng loạt các thiết lập hệ thống.
    settings_in: { "key1": "value1", "key2": "value2" }
    """
    updated_count = 0
    created_count = 0
    
    for key, value in settings_in.items():
        db_setting = db.query(SystemSetting).filter(SystemSetting.key == key).first()
        if db_setting:
            db_setting.value = str(value)
            updated_count += 1
        else:
            db_setting = SystemSetting(key=key, value=str(value))
            db.add(db_setting)
            created_count += 1
            
    db.commit()
    
    # Ghi nhật ký: Cập nhật hàng loạt (Chỉ 1 dòng log duy nhất)
    ai_audit_service.create_system_audit_log(db, AuditLogCreate(
        action="BATCH_UPDATE_SETTINGS",
        entity_type="SystemSetting",
        created_at=datetime.now()
    ))
    
    return {"message": f"Updated {updated_count}, Created {created_count} settings"}
