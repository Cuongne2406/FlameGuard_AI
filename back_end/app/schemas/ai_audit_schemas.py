from pydantic import BaseModel
from typing import Optional, List, Any
from uuid import UUID
from datetime import datetime
from enum import Enum
from decimal import Decimal

# ==========================================
# Enums from Models
# ==========================================
class SentimentLabelEnum(str, Enum):
    POSITIVE = "POSITIVE"
    NEUTRAL = "NEUTRAL"
    NEGATIVE = "NEGATIVE"

class AuditActionEnum(str, Enum):
    AUTO_PUBLISHED = "AUTO_PUBLISHED"
    FLAGGED_FOR_REVIEW = "FLAGGED_FOR_REVIEW"
    AUTO_HIDDEN = "AUTO_HIDDEN"


# ==========================================
# AI Sentiment Schemas
# ==========================================
class AISentimentBase(BaseModel):
    source_type: Optional[str] = None
    source_id: Optional[str] = None
    content_excerpt: Optional[str] = None
    sentiment_score: Optional[Decimal] = None
    sentiment_label: Optional[SentimentLabelEnum] = None
    detected_keywords: Optional[List[str]] = None
    analyzed_at: Optional[datetime] = None

class AISentimentCreate(AISentimentBase):
    pass

class AISentimentUpdate(AISentimentBase):
    pass

class AISentimentResponse(AISentimentBase):
    id: UUID

    class Config:
        from_attributes = True


# ==========================================
# AI Prediction Schemas
# ==========================================
class AIPredictionBase(BaseModel):
    predicted_attendance: Optional[int] = None
    confidence_score: Optional[Decimal] = None
    ai_recommendations: Optional[Any] = None # JSON array/object structure
    generated_at: Optional[datetime] = None

class AIPredictionCreate(AIPredictionBase):
    event_id: UUID

class AIPredictionUpdate(AIPredictionBase):
    pass

class AIPredictionResponse(AIPredictionBase):
    id: UUID
    event_id: UUID

    class Config:
        from_attributes = True


# ==========================================
# AI Audit Schemas
# ==========================================
class AIAuditBase(BaseModel):
    content_type: Optional[str] = None
    content_text: Optional[str] = None
    action_taken: Optional[AuditActionEnum] = None
    reason: Optional[str] = None
    processed_at: Optional[datetime] = None

class AIAuditCreate(AIAuditBase):
    pass

class AIAuditUpdate(AIAuditBase):
    pass

class AIAuditResponse(AIAuditBase):
    id: UUID

    class Config:
        from_attributes = True


# ==========================================
# Chatbot Log Schemas
# ==========================================
class ChatbotLogBase(BaseModel):
    question_category: Optional[str] = None
    interaction_duration_seconds: Optional[int] = None

class ChatbotLogCreate(ChatbotLogBase):
    user_id: Optional[UUID] = None

class ChatbotLogUpdate(ChatbotLogBase):
    pass

class ChatbotLogResponse(ChatbotLogBase):
    id: UUID
    user_id: Optional[UUID] = None

    class Config:
        from_attributes = True


# ==========================================
# System Audit Log Schemas (Read Only mostly)
# ==========================================
class AuditLogBase(BaseModel):
    action: str
    entity_type: str
    entity_id: Optional[UUID] = None
    old_values: Optional[Any] = None
    new_values: Optional[Any] = None
    ip_address: Optional[str] = None
    created_at: Optional[datetime] = None

class AuditLogCreate(AuditLogBase):
    user_id: Optional[UUID] = None

class AuditLogResponse(AuditLogBase):
    id: UUID
    user_id: Optional[UUID] = None

    class Config:
        from_attributes = True


class AuditDisplayResponse(BaseModel):
    id: UUID
    time: str
    user: str
    initials: str
    role: str
    action: str
    target: str
    type: str

    class Config:
        from_attributes = True

class PaginatedAuditLogResponse(BaseModel):
    items: List[AuditDisplayResponse]
    total: int
    page: int
    size: int
