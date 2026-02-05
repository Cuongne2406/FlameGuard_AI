from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime

class Participation(Base):
    __tablename__ = "participations"

    # Khóa chính ghép (Composite Primary Key) hoặc ID riêng đều được
    # Ở đây mình dùng ID riêng cho dễ quản lý
    id = Column(Integer, primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    event_id = Column(Integer, ForeignKey("events.id"))
    
    # Thời gian sinh viên bấm nút tham gia (hoặc quét QR)
    check_in_time = Column(DateTime, default=datetime.utcnow)

    # Thiết lập quan hệ để dễ truy vấn ngược xuôi
    user = relationship("User", back_populates="participations")
    event = relationship("Event", back_populates="participations")