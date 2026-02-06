from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.db.session import Base

class User(Base):
    __tablename__ = "users"  # Tên bảng trong Database

    id = Column(Integer, primary_key=True, index=True)
    mssv = Column(String, unique=True, index=True, nullable=False) # Mã số SV
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False) # Mật khẩu đã mã hóa
    role = Column(String, default="STUDENT") # SUPER_ADMIN, SUB_ADMIN, STUDENT
    is_active = Column(Boolean, default=True)

    # dòng này Để biết user này đã tạo những sự kiện nào
    events = relationship("Event", back_populates="creator")

    # Danh sách các lần tham gia sự kiện của user này
    participations = relationship("Participation", back_populates="user")