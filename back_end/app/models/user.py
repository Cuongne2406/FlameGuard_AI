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
    
    # --- THÔNG TIN CÁ NHÂN (PROFILE) ---
    phone = Column(String, nullable=True)
    birthday = Column(Date, nullable=True)     
    gender = Column(String, nullable=True)     # Nam/Nữ
    ethnicity = Column(String, nullable=True)  # Dân tộc
    address = Column(String, nullable=True)    # Địa chỉ
    join_date = Column(Date, nullable=True)    # Ngày vào Đoàn
    avatar_url = Column(String, nullable=True) # Link ảnh đại diện
    union_position = Column(String, default="Đoàn viên") 

    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # OTP bảo mật
    otp_code = Column(String, nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)

    # --- QUAN HỆ VỚI BẢNG KHÁC ---
    
    # Các thông báo mà User này NHẬN ĐƯỢC
    notifications = relationship(
        "Notification", 
        foreign_keys="[Notification.user_id]", 
        back_populates="user",
        cascade="all, delete-orphan"
    )
    
    # Các thông báo do User này TẠO RA (Admin/Sub-Admin)
    created_notifications = relationship(
        "Notification", 
        foreign_keys="[Notification.creator_id]", 
        back_populates="creator"
    )

    # Các quan hệ khác
    events = relationship("Event", back_populates="creator")
    participations = relationship("Participation", back_populates="user")
    achievements = relationship("Achievement", back_populates="user")
    transactions = relationship("Transaction", back_populates="creator")
    certificates = relationship("Certificate", back_populates="user", cascade="all, delete-orphan")