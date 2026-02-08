from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.session import Base

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)   # Tên giải thưởng / Hình thức kỷ luật
    type = Column(String, default="award")   # 'award' (Khen thưởng) hoặc 'discipline' (Kỷ luật)
    school_year = Column(String, nullable=True) # Năm học: 2023-2024
    date = Column(Date, nullable=False)      # Ngày ký quyết định
    
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="achievements")