from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    
    # Loại thông báo: "info", "warning", "urgent"
    type = Column(String, default="info") 
    
    # Quan trọng: Gửi cho ai? ("ALL", "STUDENT", "SUB_ADMIN")
    target_audience = Column(String, default="ALL")

    # Trạng thái: 'SENT' (Đã gửi) hoặc 'DRAFT' (Nháp) 
    status = Column(String, default="SENT")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Người tạo thông báo (Admin)
    creator_id = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User", back_populates="created_notifications")