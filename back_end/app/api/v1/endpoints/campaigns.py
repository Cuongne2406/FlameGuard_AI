from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.schemas.event_schemas import CampaignCreate, CampaignUpdate, CampaignResponse
from app.services import event_service

router = APIRouter()

@router.post("/", response_model=CampaignResponse)
def create_campaign(
    *,
    db: Session = Depends(get_db),
    campaign_in: CampaignCreate,
):
    """
    Tạo một chiến dịch mới.
    """
    return event_service.create_campaign(db=db, campaign_in=campaign_in)

@router.get("/", response_model=List[CampaignResponse])
def read_campaigns(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách các chiến dịch.
    """
    return event_service.get_campaigns(db, skip=skip, limit=limit)

@router.get("/{campaign_id}", response_model=CampaignResponse)
def read_campaign(
    *,
    db: Session = Depends(get_db),
    campaign_id: UUID,
):
    """
    Lấy chi tiết một chiến dịch.
    """
    return event_service.get_campaign(db=db, campaign_id=campaign_id)

@router.put("/{campaign_id}", response_model=CampaignResponse)
def update_campaign(
    *,
    db: Session = Depends(get_db),
    campaign_id: UUID,
    campaign_in: CampaignUpdate,
):
    """
    Cập nhật thông tin chiến dịch.
    """
    return event_service.update_campaign(db=db, campaign_id=campaign_id, campaign_in=campaign_in)

@router.delete("/{campaign_id}")
def delete_campaign(
    *,
    db: Session = Depends(get_db),
    campaign_id: UUID,
):
    """
    Xóa chiến dịch.
    """
    return event_service.delete_campaign(db=db, campaign_id=campaign_id)
