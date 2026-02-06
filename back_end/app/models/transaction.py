from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base
import enum

# Định nghĩa loại giao dịch: THU hoặc CHI
class TransactionType(str, enum.Enum):
    INCOME = "INCOME"   # Thu
    EXPENSE = "EXPENSE" # Chi

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)        # Nội dung (vd: Thu hội phí)
    amount = Column(Float, nullable=False)        # Số tiền (Luôn dương)
    type = Column(String, nullable=False)         # INCOME hoặc EXPENSE
    category = Column(String, nullable=True)      # Danh mục (Hội phí, Sự kiện,...)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Người tạo/duyệt giao dịch
    creator_id = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User", back_populates="transactions")