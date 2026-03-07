import uuid
from datetime import datetime
from sqlalchemy.orm import DeclarativeBase, declared_attr
from sqlalchemy import Column, DateTime, func

class Base(DeclarativeBase):
    # Auto-generate __tablename__
    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower() + "s" if not cls.__name__.endswith("s") else cls.__name__.lower()
    
    # Audit fields defaults
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    deleted_at = Column(DateTime(timezone=True), nullable=True)
