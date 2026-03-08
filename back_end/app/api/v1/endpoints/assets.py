from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.schemas.finance_schemas import AssetCreate, AssetUpdate, AssetResponse
from app.services import finance_service

router = APIRouter()

@router.post("/", response_model=AssetResponse)
def create_asset(
    *,
    db: Session = Depends(get_db),
    asset_in: AssetCreate,
):
    return finance_service.create_asset(db=db, asset_in=asset_in)

@router.get("/", response_model=List[AssetResponse])
def read_assets(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return finance_service.get_assets(db, skip=skip, limit=limit)

@router.put("/{asset_id}", response_model=AssetResponse)
def update_asset(
    *,
    db: Session = Depends(get_db),
    asset_id: UUID,
    asset_in: AssetUpdate,
):
    return finance_service.update_asset(db=db, asset_id=asset_id, asset_in=asset_in)

@router.delete("/{asset_id}")
def delete_asset(
    *,
    db: Session = Depends(get_db),
    asset_id: UUID,
):
    return finance_service.delete_asset(db=db, asset_id=asset_id)
