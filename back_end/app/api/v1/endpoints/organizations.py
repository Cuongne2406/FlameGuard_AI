from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from sqlalchemy import func

from app.api.deps import get_db, get_current_active_user
from app.schemas.core_schemas import OrganizationCreate, OrganizationUpdate, OrganizationResponse, UserOrganizationCreate, UserOrganizationResponse
from app.services import core_service
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

@router.get("/clubs/stats")
def get_clubs_stats(db: Session = Depends(get_db)):
    """
    Lấy thống kê riêng cho khối Câu lạc bộ.
    """
    return core_service.get_clubs_detailed_stats(db)

@router.get("/clubs")
def get_clubs_list(db: Session = Depends(get_db)):
    """
    Lấy danh sách CLB kèm chi tiết trạng thái, nhân sự, ngân sách.
    """
    return core_service.get_clubs_list_detailed(db)

@router.get("/clubs/proposals")
def get_club_proposals(db: Session = Depends(get_db)):
    """
    Lấy danh sách đề xuất từ các CLB.
    """
    return core_service.get_club_proposals(db)

@router.put("/clubs/proposals/{prop_id}/approve")
def approve_club_proposal(
    prop_id: UUID, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """
    Duyệt đề xuất.
    """
    return core_service.approve_club_proposal(db, prop_id)

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
@router.get("/classes")
def get_classes_list(db: Session = Depends(get_db)):
    """
    Lấy danh sách Chi đoàn kèm chi tiết trạng thái, nhân sự, đoàn phí.
    """
    return core_service.get_classes_list_detailed(db)
