from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False) # Tên hoạt động
    description = Column(Text, nullable=True) # Mô tả chi tiết
    location = Column(String, nullable=False) # Địa điểm
    start_time = Column(DateTime, default=datetime.utcnow) # Thời gian bắt đầu
    end_time = Column(DateTime, nullable=True) # Thời gian kết thúc
    max_participants = Column(Integer, default=100)
    status = Column(String, default="UPCOMING") # UPCOMING, ONGOING, COMPLETED
    points = Column(Integer, default=10) # Mặc định mỗi sự kiện 10 điểm
    
    # Ai là người tạo sự kiện này? (Liên kết với bảng User)
    creator_id = Column(Integer, ForeignKey("users.id"))
    
    # Thiết lập mối quan hệ để truy vấn dễ hơn
    creator = relationship("User", back_populates="events")

    # Danh sách các sinh viên tham gia sự kiện này
    participations = relationship("Participation", back_populates="event")

    # Lưu link ảnh
    image_url = Column(String, nullable=True)