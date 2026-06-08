from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_user, get_current_active_admin
from app.schemas.award_schemas import (
    AwardCreate, AwardUpdate, AwardResponse,
    AwardCriteriaCreate, AwardCriteriaResponse
)
from app.models.awards import Award, AwardCriteria, AwardStatus
from app.models.core import User as DBUser, UserOrganization
from app.services import award_service

router = APIRouter()

@router.post("/", response_model=AwardResponse)
def create_award(
    *,
    db: Session = Depends(get_db),
    award_in: AwardCreate,
    current_user = Depends(get_current_active_user),
):
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if not is_admin:
        award_in.user_id = current_user.id
    return award_service.create_award_application(db=db, award_in=award_in)

@router.get("/", response_model=List[AwardResponse])
def read_awards(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if is_admin:
        return award_service.get_awards_list(db, skip=skip, limit=limit)
        
    # Lọc hồ sơ khen thưởng của chính sinh viên đăng nhập
    awards = db.query(Award).filter(Award.user_id == current_user.id).options(
        joinedload(Award.user).joinedload(DBUser.organizations).joinedload(UserOrganization.organization)
    ).offset(skip).limit(limit).all()
    
    for award in awards:
        if award.user:
            award.full_name = award.user.full_name
            award.student_id = award.user.student_id
            
            primary_org = next((uo.organization for uo in award.user.organizations if uo.is_primary), None)
            if not primary_org and award.user.organizations:
                primary_org = award.user.organizations[0].organization
            
            if primary_org:
                award.class_name = primary_org.name
                
    return awards

@router.get("/stats")
def read_award_stats(
    timescale: str = "Tháng này",
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    return award_service.get_award_stats(db=db, timescale=timescale)

@router.get("/leaderboard")
def read_award_leaderboard(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    return award_service.get_full_leaderboard(db=db)

@router.get("/{award_id}", response_model=AwardResponse)
def read_award(
    award_id: UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    award = db.query(Award).filter(Award.id == award_id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")
        
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if not is_admin and award.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bạn không có quyền truy cập hồ sơ này")
        
    return award

@router.put("/{award_id}", response_model=AwardResponse)
def update_award(
    *,
    db: Session = Depends(get_db),
    award_id: UUID,
    award_in: AwardUpdate,
    current_user = Depends(get_current_active_user),
):
    award = db.query(Award).filter(Award.id == award_id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")
        
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if not is_admin and award.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bạn không có quyền chỉnh sửa hồ sơ này")
        
    updated_award = award_service.update_award_assessment(db=db, award_id=award_id, award_in=award_in)
    return updated_award

@router.delete("/{award_id}")
def delete_award(
    *,
    db: Session = Depends(get_db),
    award_id: UUID,
    current_user = Depends(get_current_active_user),
):
    award = db.query(Award).filter(Award.id == award_id).first()
    if not award:
        raise HTTPException(status_code=404, detail="Award not found")
        
    is_admin = any(role.name in ["ADMIN", "UNIVERSITY_ADMIN", "FACULTY_ADMIN"] for role in current_user.roles)
    if not is_admin and award.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Bạn không có quyền xóa hồ sơ này")
        
    db.delete(award)
    db.commit()
    return {"message": "Award deleted successfully"}

# ==========================================
# Admin Criteria Management
# ==========================================

@router.get("/criteria", response_model=List[AwardCriteriaResponse])
def get_criteria(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
):
    return db.query(AwardCriteria).all()

@router.post("/criteria", response_model=AwardCriteriaResponse)
def create_criteria(
    *,
    db: Session = Depends(get_db),
    criteria_in: AwardCriteriaCreate,
    current_admin = Depends(get_current_active_admin),
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
    current_admin = Depends(get_current_active_admin),
):
    db_obj = db.query(AwardCriteria).filter(AwardCriteria.id == criteria_id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Criteria not found")
    db.delete(db_obj)
    db.commit()
    return {"message": "Criteria deleted"}

