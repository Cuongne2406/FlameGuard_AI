from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    mssv = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="STUDENT")
    class_name = Column(String, nullable=True) # Chi đoàn
    
    # --- [BỔ SUNG CÁC TRƯỜNG MỚI CHO PROFILE] ---
    phone = Column(String, nullable=True)
    birthday = Column(Date, nullable=True)     
    gender = Column(String, nullable=True)     # Nam/Nữ
    ethnicity = Column(String, nullable=True)  # Dân tộc
    address = Column(String, nullable=True)    # Địa chỉ
    join_date = Column(Date, nullable=True)    # Ngày vào Đoàn
    avatar_url = Column(String, nullable=True) # Link ảnh đại diện
    
    # Chức vụ đoàn
    union_position = Column(String, default="Đoàn viên") 

    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True), nullable=True)

    # Quan hệ
    events = relationship("Event", back_populates="creator")
    participations = relationship("Participation", back_populates="user")
    created_notifications = relationship("Notification", back_populates="creator")
    # Quan hệ với bảng Khen thưởng
    achievements = relationship("Achievement", back_populates="user")

    transactions = relationship("Transaction", back_populates="creator")
    
    otp_code = Column(String, nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
