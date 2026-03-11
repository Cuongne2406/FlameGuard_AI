from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.models.awards import Award
from app.schemas.award_schemas import AwardCreate, AwardUpdate, AwardResponse

router = APIRouter()

@router.post("/", response_model=AwardResponse)
def create_award(
    *,
    db: Session = Depends(get_db),
    award_in: AwardCreate,
):
    db_obj = Award(**award_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=List[AwardResponse])
def read_awards(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return db.query(Award).offset(skip).limit(limit).all()

@router.get("/{award_id}", response_model=AwardResponse)
def read_award(
    award_id: UUID,
    db: Session = Depends(get_db)
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
    award = db.query(Award).filter(Award.id == award_id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")
    
    update_data = award_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(award, field, value)
        
    db.add(award)
    db.commit()
    db.refresh(award)
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
