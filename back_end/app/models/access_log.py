from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.session import Base

class AccessLog(Base):
    __tablename__ = "access_logs"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True) # Lưu email người đăng nhập
    role = Column(String, nullable=True) # Lưu quyền (VD: ADMIN, STUDENT...)
    ip_address = Column(String)
    status = Column(String) # "SUCCESS" hoặc "FAILED"
    created_at = Column(DateTime(timezone=True), server_default=func.now())