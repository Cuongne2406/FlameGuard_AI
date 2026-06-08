from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_admin
from app.schemas.core_schemas import PermissionCreate, PermissionUpdate, PermissionResponse
from app.services import core_service

router = APIRouter()

@router.post("/", response_model=PermissionResponse)
def create_permission(
    *,
    db: Session = Depends(get_db),
    permission_in: PermissionCreate,
    current_admin = Depends(get_current_active_admin),
):
    return core_service.create_permission(db=db, perm_in=permission_in)

@router.get("/", response_model=List[PermissionResponse])
def read_permissions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    return core_service.get_permissions(db, skip=skip, limit=limit)

@router.put("/{permission_id}", response_model=PermissionResponse)
def update_permission(
    *,
    db: Session = Depends(get_db),
    permission_id: UUID,
    permission_in: PermissionUpdate,
    current_admin = Depends(get_current_active_admin),
):
    return core_service.update_permission(db=db, perm_id=permission_id, perm_in=permission_in)

@router.delete("/{permission_id}")
def delete_permission(
    *,
    db: Session = Depends(get_db),
    permission_id: UUID,
    current_admin = Depends(get_current_active_admin),
):
    return core_service.delete_permission(db=db, perm_id=permission_id)

