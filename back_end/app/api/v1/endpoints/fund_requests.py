from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.schemas.finance_schemas import FundRequestCreate, FundRequestUpdate, FundRequestResponse
from app.services import finance_service

router = APIRouter()

@router.post("/", response_model=FundRequestResponse)
def create_fund_request(
    *,
    db: Session = Depends(get_db),
    request_in: FundRequestCreate,
):
    return finance_service.create_fund_request(db=db, request_in=request_in)

@router.get("/", response_model=List[FundRequestResponse])
def read_fund_requests(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return finance_service.get_fund_requests(db, skip=skip, limit=limit)

@router.put("/{request_id}", response_model=FundRequestResponse)
def update_fund_request(
    *,
    db: Session = Depends(get_db),
    request_id: UUID,
    request_in: FundRequestUpdate,
):
    return finance_service.update_fund_request(db=db, request_id=request_id, request_in=request_in)
