from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.schemas.core_schemas import UserCreate, UserUpdate, UserResponse
from app.services import core_service

router = APIRouter()

@router.post("/", response_model=UserResponse)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
):
    return core_service.create_user(db=db, user_in=user_in)

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
