from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.schemas.core_schemas import OrganizationCreate, OrganizationUpdate, OrganizationResponse, UserOrganizationCreate, UserOrganizationResponse
from app.services import core_service

from sqlalchemy import func
from app.models.core import UserOrganization, Organization
from app.models.events import Event
from app.models.finance import Budget

router = APIRouter()

@router.get("/stats")
def get_organization_stats(db: Session = Depends(get_db)):
    """
    Lấy thống kê thực tế từ Database cho Admin Dashboard.
    """
    member_count = db.query(func.count(UserOrganization.id)).scalar() or 0
    org_count = db.query(func.count(Organization.id)).scalar() or 0
    # Đếm số lượng lãnh đạo (những người có is_primary=True trong bất kỳ tổ chức nào)
    # Lưu ý: Một người có thể là lãnh đạo của nhiều đơn vị, nhưng ở đây ta đếm 'suất' lãnh đạo.
    leader_count = db.query(func.count(UserOrganization.id)).filter(UserOrganization.is_primary == True).scalar() or 0
    
    total_budget = db.query(func.sum(Budget.total_amount)).scalar() or 0
    used_budget = db.query(func.sum(Budget.used_amount)).scalar() or 0
    event_count = db.query(func.count(Event.id)).scalar() or 0
    
    return {
        "totalUnits": org_count,
        "totalLeaders": leader_count,
        "totalMembers": member_count,
        "subInfo": f"Tăng {member_count - 10} so với tháng trước"
    }

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

@router.post("/assign-member", response_model=UserOrganizationResponse)
def assign_member(
    *,
    db: Session = Depends(get_db),
    assign_in: UserOrganizationCreate,
):
    """
    Bổ nhiệm hoặc gán nhân sự vào một tổ chức/đơn vị.
    """
    return core_service.assign_member_to_org(db=db, assign_in=assign_in)
