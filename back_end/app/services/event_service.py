from sqlalchemy.orm import Session
from uuid import UUID
from fastapi import HTTPException
from app.models.events import Campaign, Event, EventRegistration
from app.schemas.event_schemas import (
    CampaignCreate, CampaignUpdate,
    EventCreate, EventUpdate,
    EventRegistrationCreate, EventRegistrationUpdate
)

from app.models.core import Organization, AcademicTerm

# ==========================================
# Campaign Services
# ==========================================
def create_campaign(db: Session, campaign_in: CampaignCreate):
    # Verify organization exists
    organization = db.query(Organization).filter(Organization.id == campaign_in.organization_id).first()
    if not organization:
        raise HTTPException(status_code=400, detail="Organization not found")

    # Verify academic term exists
    term = db.query(AcademicTerm).filter(AcademicTerm.id == campaign_in.academic_term_id).first()
    if not term:
        raise HTTPException(status_code=400, detail="Academic Term not found")

    db_campaign = Campaign(**campaign_in.dict())
    db.add(db_campaign)
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

def get_campaigns(db: Session, skip: int = 0, limit: int = 100):
    campaigns = db.query(Campaign).offset(skip).limit(limit).all()
    # Gán tên cho response (Pydantic will pick them up)
    for camp in campaigns:
        if camp.organization:
            camp.organization_name = camp.organization.name
        if camp.academic_term:
            camp.academic_term_name = f"{camp.academic_term.semester_name} ({camp.academic_term.year_name})"
    return campaigns

def update_campaign(db: Session, campaign_id: UUID, campaign_in: CampaignUpdate):
    db_campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    update_data = campaign_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_campaign, key, value)
        
    db.commit()
    db.refresh(db_campaign)
    return db_campaign

def delete_campaign(db: Session, campaign_id: UUID):
    db_campaign = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not db_campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    db.delete(db_campaign)
    db.commit()
    return {"message": "Campaign deleted successfully"}


# ==========================================
# Event Services
# ==========================================
def create_event(db: Session, event_in: EventCreate):
    # Optional logic: verify if campaign_id exists
    if event_in.campaign_id:
        campaign = db.query(Campaign).filter(Campaign.id == event_in.campaign_id).first()
        if not campaign:
             raise HTTPException(status_code=404, detail="Campaign not found")

    db_event = Event(**event_in.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Event).offset(skip).limit(limit).all()

def get_events_by_campaign(db: Session, campaign_id: UUID, skip: int = 0, limit: int = 100):
    return db.query(Event).filter(Event.campaign_id == campaign_id).offset(skip).limit(limit).all()

def update_event(db: Session, event_id: UUID, event_in: EventUpdate):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_event, key, value)
        
    db.commit()
    db.refresh(db_event)
    return db_event

def delete_event(db: Session, event_id: UUID):
    db_event = db.query(Event).filter(Event.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(db_event)
    db.commit()
    return {"message": "Event deleted successfully"}


# ==========================================
# Event Registration Services
# ==========================================
def register_for_event(db: Session, registration_in: EventRegistrationCreate):
    # 1. Check if event exists and is not DRAFT or ENDED
    event = db.query(Event).filter(Event.id == registration_in.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if event.status.value in ["DRAFT", "ENDED"]:
        raise HTTPException(status_code=400, detail="Registration is not open for this event")
        
    # 2. Check Capacity
    if event.capacity is not None:
        current_regs = db.query(EventRegistration).filter(
            EventRegistration.event_id == event.id,
            EventRegistration.status != "CANCELLED"
        ).count()
        if current_regs >= event.capacity:
            raise HTTPException(status_code=400, detail="Event is already full")
            
    # 3. Check if user already registered
    existing_reg = db.query(EventRegistration).filter(
        EventRegistration.event_id == registration_in.event_id,
        EventRegistration.user_id == registration_in.user_id
    ).first()
    
    if existing_reg:
        if existing_reg.status.value == "CANCELLED":
            # Re-register
            existing_reg.status = "REGISTERED"
            db.commit()
            db.refresh(existing_reg)
            return existing_reg
        else:
            raise HTTPException(status_code=400, detail="User is already registered for this event")

    # 4. Create new registration
    db_registration = EventRegistration(**registration_in.dict())
    db.add(db_registration)
    db.commit()
    db.refresh(db_registration)
    return db_registration

def get_event_registrations(db: Session, event_id: UUID, skip: int = 0, limit: int = 100):
    return db.query(EventRegistration).filter(EventRegistration.event_id == event_id).offset(skip).limit(limit).all()

def update_event_registration(db: Session, registration_id: UUID, registration_in: EventRegistrationUpdate):
    db_registration = db.query(EventRegistration).filter(EventRegistration.id == registration_id).first()
    if not db_registration:
        raise HTTPException(status_code=404, detail="Registration not found")
    
    update_data = registration_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_registration, key, value)
        
    db.commit()
    db.refresh(db_registration)
    return db_registration
