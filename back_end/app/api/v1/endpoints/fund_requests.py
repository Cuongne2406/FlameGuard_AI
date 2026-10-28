from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.api.deps import get_db, get_user_faculty_org, get_current_active_user
from app.models.core import Organization, User
from app.schemas.finance_schemas import FundRequestCreate, FundRequestUpdate, FundRequestResponse
from app.services import finance_service

router = APIRouter()

@router.post("/", response_model=FundRequestResponse)
def create_fund_request(
    *,
    db: Session = Depends(get_db),
    request_in: FundRequestCreate,
    current_user: User = Depends(get_current_active_user),
    faculty_org: Optional[Organization] = Depends(get_user_faculty_org)
):
    return finance_service.create_fund_request(
        db=db, 
        request_in=request_in, 
        user=current_user, 
        faculty_org=faculty_org
    )

@router.get("/", response_model=List[FundRequestResponse])
def read_fund_requests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    faculty_org: Optional[Organization] = Depends(get_user_faculty_org)
):
    return finance_service.get_fund_requests(db, skip=skip, limit=limit, faculty_org=faculty_org)

@router.put("/{request_id}", response_model=FundRequestResponse)
def update_fund_request(
    *,
    db: Session = Depends(get_db),
    request_id: UUID,
    request_in: FundRequestUpdate,
):
    return finance_service.update_fund_request(db=db, request_id=request_id, request_in=request_in)
