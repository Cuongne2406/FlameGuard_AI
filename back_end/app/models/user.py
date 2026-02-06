from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    mssv = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True) # Để True cho linh hoạt
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="STUDENT")
    class_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True) # Chỉ giữ 1 dòng này
    last_login = Column(DateTime(timezone=True), nullable=True)
    events = relationship("Event", back_populates="creator")
    participations = relationship("Participation", back_populates="user")
    created_notifications = relationship("Notification", back_populates="creator")
    transactions = relationship("Transaction", back_populates="creator")

    otp_code = Column(String, nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
