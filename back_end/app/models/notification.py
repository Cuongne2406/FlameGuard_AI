from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    type = Column(String, default="info") 
    target_audience = Column(String, default="ALL")
    # Trạng thái: 'SENT' (Đã gửi) hoặc 'DRAFT' (Nháp)
    status = Column(String, default="SENT")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    creator_id = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User", back_populates="created_notifications")