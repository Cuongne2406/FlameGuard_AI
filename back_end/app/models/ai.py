import uuid
from sqlalchemy import Column, String, Integer, Enum, ForeignKey, DateTime, Numeric, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.base_class import Base
import enum

class SentimentLabel(enum.Enum):
    POSITIVE = "Positive"
    NEUTRAL = "Neutral"
    NEGATIVE = "Negative"

class AuditAction(enum.Enum):
    AUTO_PUBLISHED = "Auto-Published"
    FLAGGED_FOR_REVIEW = "Flagged for Review"
    AUTO_HIDDEN = "Auto-Hidden"

class AISentiment(Base):
    __tablename__ = "ai_sentiments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_type = Column(String) # Ví dụ: Social Media, Portal
    source_id = Column(String)
    content_excerpt = Column(Text)
    sentiment_score = Column(Numeric(3, 2)) # Từ -1.00 đến 1.00
    sentiment_label = Column(Enum(SentimentLabel))
    detected_keywords = Column(JSONB) # List các hashtag/từ khóa
    analyzed_at = Column(DateTime(timezone=True))

class AIPrediction(Base):
    __tablename__ = "ai_predictions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    predicted_attendance = Column(Integer)
    confidence_score = Column(Numeric(3, 2))
    ai_recommendations = Column(JSONB)
    generated_at = Column(DateTime(timezone=True))
    
    event = relationship("Event", back_populates="ai_predictions")

class AIAudit(Base):
    __tablename__ = "ai_audits"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content_type = Column(String) # e.g. Comment, Post
    content_text = Column(Text)
    action_taken = Column(Enum(AuditAction))
    reason = Column(String)
    processed_at = Column(DateTime(timezone=True))

class ChatbotLog(Base):
    __tablename__ = "chatbot_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    question_category = Column(String)
    interaction_duration_seconds = Column(Integer)
    
    user = relationship("User")
