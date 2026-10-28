from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from sqlalchemy import func

from datetime import datetime, timedelta

from app.api.deps import get_db, get_current_active_user, get_user_faculty_org
from app.schemas.core_schemas import OrganizationCreate, OrganizationUpdate, OrganizationResponse, UserOrganizationCreate, UserOrganizationResponse, ClubProposalCreate
from app.services import core_service
from app.models.core import UserOrganization, Organization, OrgType
from app.models.events import Event
from app.models.finance import Budget

router = APIRouter()

@router.get("/stats")
def get_organization_stats(
    faculty_id: Optional[UUID] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
    faculty_org = Depends(get_user_faculty_org)
):
    """
    Lấy thống kê thực tế từ Database cho Admin Dashboard hoặc SubAdmin Dashboard.
    """
    target_faculty_id = faculty_id or (faculty_org.id if faculty_org else None)
    if target_faculty_id:
        return core_service.get_organization_stats(db, faculty_id=target_faculty_id)

    member_count = db.query(func.count(UserOrganization.id)).scalar() or 0
    org_count = db.query(func.count(Organization.id)).scalar() or 0
    leader_count = db.query(func.count(UserOrganization.id)).filter(UserOrganization.is_primary == True).scalar() or 0
    
    total_budget = db.query(func.sum(Budget.total_amount)).scalar() or 0
    used_budget = db.query(func.sum(Budget.used_amount)).scalar() or 0
    event_count = db.query(func.count(Event.id)).scalar() or 0
    
    # Calculate real growth in past 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_members = db.query(func.count(UserOrganization.id)).filter(
        UserOrganization.created_at >= thirty_days_ago
    ).scalar() or 0
    
    sub_info = f"+{recent_members} thành viên mới trong tháng qua" if recent_members > 0 else f"{member_count} thành viên đã tham gia"
    
    return {
        "totalUnits": org_count,
        "totalLeaders": leader_count,
        "totalMembers": member_count,
        "totalClasses": db.query(func.count(Organization.id)).filter(Organization.type == OrgType.CLASS).scalar() or 0,
        "alertClasses": db.query(func.count(Organization.id)).filter(Organization.type == OrgType.CLASS, Organization.warning_message != None).scalar() or 0,
        "feePercent": round(float(db.query(func.avg(Organization.fee_percentage)).filter(Organization.type == OrgType.CLASS).scalar() or 0), 1),
        "totalStudents": member_count,
        "subInfo": sub_info
    }

@router.get("/clubs/stats")
def get_clubs_stats(
    faculty_id: Optional[UUID] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
    faculty_org = Depends(get_user_faculty_org)
):
    """
    Lấy thống kê riêng cho khối Câu lạc bộ.
    """
    target_faculty_id = faculty_id or (faculty_org.id if faculty_org else None)
    return core_service.get_clubs_detailed_stats(db, faculty_id=target_faculty_id)

@router.get("/clubs")
def get_clubs_list(
    faculty_id: Optional[UUID] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
    faculty_org = Depends(get_user_faculty_org)
):
    """
    Lấy danh sách CLB kèm chi tiết trạng thái, nhân sự, ngân sách.
    """
    target_faculty_id = faculty_id or (faculty_org.id if faculty_org else None)
    return core_service.get_clubs_list_detailed(db, faculty_id=target_faculty_id)

@router.get("/clubs/proposals")
def get_club_proposals(db: Session = Depends(get_db)):
    """
    Lấy danh sách đề xuất từ các CLB.
    """
    return core_service.get_club_proposals(db)

@router.post("/clubs/proposals")
def create_club_proposal(
    prop_in: ClubProposalCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user)
):
    """
    Gửi đề xuất hỗ trợ / hoạt động CLB.
    """
    return core_service.create_club_proposal(db, prop_in, current_user.id)

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
    current_user = Depends(get_current_active_user),
    faculty_org = Depends(get_user_faculty_org)
):
    # Auto-assign parent_id if user is FACULTY_ADMIN and parent_id is missing
    type_val = org_in.type.value if hasattr(org_in.type, 'value') else str(org_in.type)
    if not org_in.parent_id and faculty_org and type_val in ["CLASS", "CLUB"]:
        org_in.parent_id = faculty_org.id
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
def get_classes_list(
    faculty_id: Optional[UUID] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_active_user),
    faculty_org = Depends(get_user_faculty_org)
):
    """
    Lấy danh sách Chi đoàn kèm chi tiết trạng thái, nhân sự, đoàn phí (lọc theo Khoa).
    """
    target_faculty_id = faculty_id or (faculty_org.id if faculty_org else None)
    return core_service.get_classes_list_detailed(db, faculty_id=target_faculty_id)

@router.get("/{org_id}/members")
def get_organization_members(org_id: UUID, db: Session = Depends(get_db)):
    """
    Lấy danh sách thành viên của một tổ chức/lớp, được sắp xếp theo tên.
    """
    return core_service.get_organization_members(db, org_id)
