from sqlalchemy import Column, Integer, ForeignKey, DateTime, String, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base

class Participation(Base):
    __tablename__ = "participations"

    id = Column(Integer, primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"))
    
    # Thời gian sinh viên thực hiện Check-in và Check-out thực tế
    check_in_time = Column(DateTime(timezone=True), server_default=func.now())
    check_out_time = Column(DateTime(timezone=True), nullable=True)

    # Trạng thái: 'REGISTERED' (Mới đăng ký), 'ATTENDED' (Đã tham gia), 'ABSENT' (Vắng mặt)
    status = Column(String, default="ATTENDED")

    # Điểm thực nhận (đôi khi admin có thể điều chỉnh điểm riêng cho từng bạn)
    earned_points = Column(Integer, nullable=True)

    # Thiết lập quan hệ để lấy dữ liệu từ các bảng liên quan
    user = relationship("User", back_populates="participations")
    event = relationship("Event", back_populates="participations")