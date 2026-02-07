from sqlalchemy import Column, Integer, String, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.session import Base

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)        # Tên chứng nhận
    type = Column(String, default="academic")     # academic, volunteer, award...
    issuer = Column(String)                       # Đơn vị cấp (Hội Sinh viên, Đoàn trường...)
    date = Column(Date)                           # Ngày cấp
    year = Column(String)                         # Năm học (2023-2024)
    level = Column(String)                        # Cấp Trường, Cấp Khoa...
    code = Column(String, unique=True, index=True)# Mã số chứng nhận (CERT-001)
    image_url = Column(String)                    # Link ảnh chứng nhận
    verified = Column(Boolean, default=True)      # Đã xác thực hay chưa
    description = Column(String, nullable=True)   # Mô tả chi tiết

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="certificates")