from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_admin
from app.schemas.core_schemas import RoleCreate, RoleUpdate, RoleResponse
from app.services import core_service

router = APIRouter()

@router.post("/", response_model=RoleResponse)
def create_role(
    *,
    db: Session = Depends(get_db),
    role_in: RoleCreate,
    current_admin = Depends(get_current_active_admin),
):
    return core_service.create_role(db=db, role_in=role_in)

@router.get("/", response_model=List[RoleResponse])
def read_roles(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_active_admin),
):
    return core_service.get_roles(db, skip=skip, limit=limit)

@router.put("/{role_id}", response_model=RoleResponse)
def update_role(
    *,
    db: Session = Depends(get_db),
    role_id: UUID,
    role_in: RoleUpdate,
    current_admin = Depends(get_current_active_admin),
):
    return core_service.update_role(db=db, role_id=role_id, role_in=role_in)

@router.delete("/{role_id}")
def delete_role(
    *,
    db: Session = Depends(get_db),
    role_id: UUID,
    current_admin = Depends(get_current_active_admin),
):
    return core_service.delete_role(db=db, role_id=role_id)

