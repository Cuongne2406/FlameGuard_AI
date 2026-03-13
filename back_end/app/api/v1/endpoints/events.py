from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db
from app.schemas.event_schemas import (
    EventCreate, EventUpdate, EventResponse,
    EventRegistrationCreate, EventRegistrationUpdate, EventRegistrationResponse
)
from app.services import event_service

router = APIRouter()

from sqlalchemy import func
from app.models.events import Event, EventStatus, EventRegistration

router = APIRouter()

@router.get("/stats")
def get_event_stats(db: Session = Depends(get_db)):
    """
    Lấy thống kê sự kiện thực tế từ Database.
    """
    total_events = db.query(func.count(Event.id)).scalar() or 0
    upcoming_events = db.query(func.count(Event.id)).filter(Event.status == EventStatus.PUBLISHED).scalar() or 0
    live_events = db.query(func.count(Event.id)).filter(Event.status == EventStatus.LIVE).scalar() or 0
    ended_events = db.query(func.count(Event.id)).filter(Event.status == EventStatus.ENDED).scalar() or 0
    total_participants = db.query(func.count(EventRegistration.id)).scalar() or 0
    total_feedback = 0 # Future requirement: add Feedback table
    avg_rating = 0.0 # Future requirement: add Feedback table
    
    return {
        "totalEvents": total_events,
        "upcomingEvents": upcoming_events,
        "liveEvents": live_events,
        "endedEvents": ended_events,
        "totalParticipants": total_participants,
        "participantTarget": 2000,
        "totalFeedback": total_feedback,
        "avgRating": avg_rating
    }

# ==========================================
# Event Endpoints
# ==========================================
@router.post("/", response_model=EventResponse)
def create_event(
    *,
    db: Session = Depends(get_db),
    event_in: EventCreate,
):
    return event_service.create_event(db=db, event_in=event_in)

@router.get("/", response_model=List[EventResponse])
def read_events(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return event_service.get_events(db, skip=skip, limit=limit)

@router.put("/{event_id}", response_model=EventResponse)
def update_event(
    *,
    db: Session = Depends(get_db),
    event_id: UUID,
    event_in: EventUpdate,
):
    return event_service.update_event(db=db, event_id=event_id, event_in=event_in)

@router.delete("/{event_id}")
def delete_event(
    *,
    db: Session = Depends(get_db),
    event_id: UUID,
):
    return event_service.delete_event(db=db, event_id=event_id)

# ==========================================
# Event Registration Endpoints
# ==========================================
@router.post("/{event_id}/register", response_model=EventRegistrationResponse)
def register_for_event(
    *,
    db: Session = Depends(get_db),
    event_id: UUID,
    registration_in: EventRegistrationCreate,
):
    """
    User đăng ký tham gia sự kiện.
    Lưu ý: registration_in.event_id phải khớp với event_id trên URL.
    """
    if str(event_id) != str(registration_in.event_id):
        raise HTTPException(status_code=400, detail="Event ID in URL does not match body")
    return event_service.register_for_event(db=db, registration_in=registration_in)

@router.get("/{event_id}/registrations", response_model=List[EventRegistrationResponse])
def get_event_registrations(
    *,
    db: Session = Depends(get_db),
    event_id: UUID,
    skip: int = 0,
    limit: int = 100,
):
    """
    Lấy danh sách người dùng đã đăng ký tham gia 1 sự kiện.
    """
    return event_service.get_event_registrations(db=db, event_id=event_id, skip=skip, limit=limit)

@router.put("/{event_id}/registrations/{registration_id}", response_model=EventRegistrationResponse)
def update_event_registration(
    *,
    db: Session = Depends(get_db),
    registration_id: UUID,
    registration_in: EventRegistrationUpdate,
):
    """
    Cập nhật trạng thái đăng ký (Ví dụ điểm danh Check-in, hoặc Hủy đăng ký).
    """
    return event_service.update_event_registration(db=db, registration_id=registration_id, registration_in=registration_in)
