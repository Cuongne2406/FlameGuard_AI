from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_admin, get_current_active_user
from app.schemas.core_schemas import UserCreate, UserUpdate, UserResponse
from app.services import core_service
from app.core.s4h_client import s4h_check_user_exists
from app.models.core import User

router = APIRouter()

@router.post("/", response_model=UserResponse)
async def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
    current_admin: User = Depends(get_current_active_admin),
):
    """
    Create new user (Admin Provisioning only).
    """
    # 1. S4H Cross Check
    if user_in.student_id:
        exists_in_s4h = await s4h_check_user_exists(user_in.student_id)
        if exists_in_s4h:
            raise HTTPException(
                status_code=400, 
                detail="Mã số sinh viên này đã tồn tại trên hệ thống S4H. Hãy yêu cầu sinh viên đăng nhập bằng mật khẩu S4H."
            )
            
    # 2. Force Default Password
    user_in.password = "123456"
    
    # 3. Handle local database checks & creation via service
    # core_service.create_user already checks for local email and student_id duplicates.
    # It also handles auth_provider=LOCAL natively.
    return core_service.create_user(db=db, user_in=user_in)

@router.get("/me", response_model=UserResponse)
def read_users_me(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get current user profile (used by frontend to check roles/redirects).
    """
    return current_user

@router.get("/", response_model=List[UserResponse])
def read_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return core_service.get_users(db, skip=skip, limit=limit)

@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    *,
    db: Session = Depends(get_db),
    user_id: UUID,
    user_in: UserUpdate,
):
    return core_service.update_user(db=db, user_id=user_id, user_in=user_in)

@router.delete("/{user_id}")
def delete_user(
    *,
    db: Session = Depends(get_db),
    user_id: UUID,
):
    return core_service.delete_user(db=db, user_id=user_id)
