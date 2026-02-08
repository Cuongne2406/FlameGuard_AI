from sqlalchemy import Column, Integer, String, Boolean
from app.db.session import Base

class SystemSetting(Base):
    __tablename__ = "system_settings"

    id = Column(Integer, primary_key=True, index=True)
    unit_name = Column(String, default="Đoàn Trường Đại Học Lạc Hồng")
    logo_url = Column(String, nullable=True)
    current_academic_year = Column(String, default="2025 - 2026")
    is_2fa_enabled = Column(Boolean, default=False)

    is_geo_block_enabled = Column(Boolean, default=False)
    min_password_length = Column(Integer, default=8)
    password_expiry_days = Column(Integer, default=90)

    is_email_enabled = Column(Boolean, default=True)
    is_mobile_enabled = Column(Boolean, default=True)
    is_zalo_enabled = Column(Boolean, default=False)