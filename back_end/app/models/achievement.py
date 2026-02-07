from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import date

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)   # Ví dụ: Đoàn viên xuất sắc
    year = Column(String, nullable=False)    # Ví dụ: 2023-2024
    type = Column(String, default="award")   # 'award' (khen thưởng) hoặc 'discipline' (kỷ luật)
    date_received = Column(Date, default=date.today)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="achievements")