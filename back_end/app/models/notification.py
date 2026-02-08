from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    
    # Các loại: urgent (khẩn), info (tin tức), success (thành công), warning (cảnh báo)
    type = Column(String, default="info") 
    
    # Trạng thái đọc (Quan trọng để filter tin chưa đọc ở Frontend)
    is_read = Column(Boolean, default=False) 
    
    # Đối tượng nhận: ALL, STUDENT, ADMIN...
    target_audience = Column(String, default="ALL")
    
    # Trạng thái gửi: 'SENT' (Đã gửi) hoặc 'DRAFT' (Bản nháp)
    status = Column(String, default="SENT")
    
    # Thời gian tạo tự động
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # --- ĐỊNH NGHĨA KHÓA NGOẠI ---
    
    # 1. user_id: ID của người nhận thông báo
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    
    # 2. creator_id: ID của người tạo thông báo (Admin/Sub-Admin)
    creator_id = Column(Integer, ForeignKey("users.id"))

    # --- THIẾT LẬP QUAN HỆ (Relationship) ---
    
    # Quan hệ với người nhận
    user = relationship(
        "User", 
        foreign_keys=[user_id], 
        back_populates="notifications"
    )
    
    # Quan hệ với người tạo
    creator = relationship(
        "User", 
        foreign_keys=[creator_id], 
        back_populates="created_notifications"
    )