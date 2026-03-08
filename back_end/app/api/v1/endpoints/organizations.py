from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.schemas.core_schemas import OrganizationCreate, OrganizationUpdate, OrganizationResponse
from app.services import core_service

router = APIRouter()

@router.post("/", response_model=OrganizationResponse)
def create_organization(
    *,
    db: Session = Depends(get_db),
    org_in: OrganizationCreate,
):
    return core_service.create_organization(db=db, org_in=org_in)

@router.get("/", response_model=List[OrganizationResponse])
def read_organizations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return core_service.get_organizations(db, skip=skip, limit=limit)

@router.put("/{org_id}", response_model=OrganizationResponse)
def update_organization(
    *,
    db: Session = Depends(get_db),
    org_id: UUID,
    org_in: OrganizationUpdate,
):
    return core_service.update_organization(db=db, org_id=org_id, org_in=org_in)

@router.delete("/{org_id}")
def delete_organization(
    *,
    db: Session = Depends(get_db),
    org_id: UUID,
):
    return core_service.delete_organization(db=db, org_id=org_id)
