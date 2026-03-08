from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.schemas.core_schemas import AcademicTermCreate, AcademicTermUpdate, AcademicTermResponse
from app.services import core_service

router = APIRouter()

@router.post("/", response_model=AcademicTermResponse)
def create_academic_term(
    *,
    db: Session = Depends(get_db),
    term_in: AcademicTermCreate,
):
    return core_service.create_academic_term(db=db, term_in=term_in)

@router.get("/", response_model=List[AcademicTermResponse])
def read_academic_terms(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return core_service.get_academic_terms(db, skip=skip, limit=limit)

@router.put("/{term_id}", response_model=AcademicTermResponse)
def update_academic_term(
    *,
    db: Session = Depends(get_db),
    term_id: UUID,
    term_in: AcademicTermUpdate,
):
    return core_service.update_academic_term(db=db, term_id=term_id, term_in=term_in)

@router.delete("/{term_id}")
def delete_academic_term(
    *,
    db: Session = Depends(get_db),
    term_id: UUID,
):
    return core_service.delete_academic_term(db=db, term_id=term_id)
