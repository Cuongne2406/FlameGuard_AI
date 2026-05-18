from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.models.awards import Award, AwardCriteria
from app.models.core import User
from app.schemas.award_schemas import (
    AwardCampaignConfigResponse,
    AwardCampaignHistoryItem,
    AwardCampaignConfigUpdate,
    AwardCreate,
    AwardCriteriaCreate,
    AwardCriteriaResponse,
    AwardResponse,
    AwardUpdate,
)
from app.services import award_service

router = APIRouter()


def _is_admin_user(current_user: User) -> bool:
    return any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)


@router.post("/", response_model=AwardResponse)
def create_award(
    *,
    db: Session = Depends(get_db),
    award_in: AwardCreate,
    current_user: User = Depends(get_current_active_user),
):
    is_admin = _is_admin_user(current_user)
    if not is_admin and award_in.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot create award application for another user")
    try:
        return award_service.create_award_application(db=db, award_in=award_in)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/", response_model=List[AwardResponse])
def read_awards(
    skip: int = 0,
    limit: int = 100,
    award_name: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    is_admin = _is_admin_user(current_user)
    return award_service.get_awards_list(
        db,
        skip=skip,
        limit=limit,
        user_id=None if is_admin else current_user.id,
        award_name=award_name,
    )


@router.get("/config/current", response_model=AwardCampaignConfigResponse)
def read_current_award_campaign_config(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    return award_service.get_award_campaign_config(db=db)


@router.put("/config/current", response_model=AwardCampaignConfigResponse)
def update_current_award_campaign_config(
    *,
    db: Session = Depends(get_db),
    config_in: AwardCampaignConfigUpdate,
    current_user: User = Depends(get_current_active_user),
):
    if not _is_admin_user(current_user):
        raise HTTPException(status_code=403, detail="The user doesn't have enough privileges")
    return award_service.update_award_campaign_config(
        db=db,
        config_data=config_in.model_dump(exclude_unset=True),
        actor=current_user,
    )


@router.get("/config/history", response_model=List[AwardCampaignHistoryItem])
def read_award_campaign_history(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if not _is_admin_user(current_user):
        raise HTTPException(status_code=403, detail="The user doesn't have enough privileges")
    return award_service.get_award_campaign_history(db=db, limit=limit)


@router.get("/stats")
def read_award_stats(
    timescale: str = "Thang nay",
    award_name: str | None = None,
    db: Session = Depends(get_db),
):
    return award_service.get_award_stats(db=db, timescale=timescale, award_name=award_name)


@router.get("/{award_id}", response_model=AwardResponse)
def read_award(
    award_id: UUID,
    db: Session = Depends(get_db),
):
    award = db.query(Award).filter(Award.id == award_id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")
    return award


@router.put("/{award_id}", response_model=AwardResponse)
def update_award(
    *,
    db: Session = Depends(get_db),
    award_id: UUID,
    award_in: AwardUpdate,
):
    award = award_service.update_award_assessment(db=db, award_id=award_id, award_in=award_in)
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")
    return award


@router.delete("/{award_id}")
def delete_award(
    *,
    db: Session = Depends(get_db),
    award_id: UUID,
):
    award = db.query(Award).filter(Award.id == award_id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")
    db.delete(award)
    db.commit()
    return {"message": "Award deleted successfully"}


@router.get("/criteria", response_model=List[AwardCriteriaResponse])
def get_criteria(db: Session = Depends(get_db)):
    return db.query(AwardCriteria).all()


@router.post("/criteria", response_model=AwardCriteriaResponse)
def create_criteria(
    *,
    db: Session = Depends(get_db),
    criteria_in: AwardCriteriaCreate,
):
    db_obj = AwardCriteria(**criteria_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


@router.delete("/criteria/{criteria_id}")
def delete_criteria(
    *,
    db: Session = Depends(get_db),
    criteria_id: UUID,
):
    db_obj = db.query(AwardCriteria).filter(AwardCriteria.id == criteria_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Criteria not found")
    db.delete(db_obj)
    db.commit()
    return {"message": "Criteria deleted"}
