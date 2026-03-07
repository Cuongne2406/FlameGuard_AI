import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.base_class import Base

class AuditLog(Base):
    """
    Bảng thứ 20: Nhật ký Hệ thống Cốt lõi (System Audit Logs)
    Dùng để theo dõi ai đã làm gì (CRUD/Duyệt chi/Tạo chiến dịch) phục vụ đối soát.
    """
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True) # Người thực hiện hành động
    action = Column(String, nullable=False) # e.g., 'CREATE', 'UPDATE', 'DELETE', 'APPROVE_FUND'
    entity_type = Column(String, nullable=False) # e.g., 'FundRequest', 'Campaign'
    entity_id = Column(UUID(as_uuid=True), nullable=True) # ID của record bị tác động
    old_values = Column(JSONB, nullable=True) # Dữ liệu trước khi sửa
    new_values = Column(JSONB, nullable=True) # Dữ liệu sau khi sửa
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True))
    
    user = relationship("User", backref="audit_logs")
