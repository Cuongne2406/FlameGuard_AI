import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Text, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base_class import Base

class News(Base):
    __tablename__ = "news"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    category = Column(String)
    excerpt = Column(Text)
    content = Column(Text)
    image_url = Column(String)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now())
    
    author = relationship("User", backref="articles")
