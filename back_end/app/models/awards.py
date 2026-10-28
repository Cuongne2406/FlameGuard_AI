import uuid
import enum
from datetime import datetime, date
from sqlalchemy import Column, String, ForeignKey, Date, DateTime, Enum, Text, Integer, Float, Numeric, Boolean, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.base_class import Base

class AwardPeriodStatus(str, enum.Enum):
    UPCOMING = "UPCOMING"
    ONGOING = "ONGOING"
    ENDED = "ENDED"

class StandardRuleType(str, enum.Enum):
    REQUIRED = "REQUIRED"
    GROUP_SELECT = "GROUP_SELECT"

class AwardStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PENDING_SCHOOL = "PENDING_SCHOOL"
    PENDING_PROVINCE = "PENDING_PROVINCE"
    PROVINCE_RETURNED = "PROVINCE_RETURNED"
    QUALIFIED = "QUALIFIED"
    UNQUALIFIED = "UNQUALIFIED"
    RETURNED = "RETURNED"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    # Legacy alias
    PENDING = "PENDING"

class TargetType(str, enum.Enum):
    INDIVIDUAL = "INDIVIDUAL"
    COLLECTIVE = "COLLECTIVE"

class CriteriaType(str, enum.Enum):
    MIN_GPA = "MIN_GPA"
    MIN_TRAINING_SCORE = "MIN_TRAINING_SCORE"
    MIN_EVENTS_ATTENDED = "MIN_EVENTS_ATTENDED"
    REQUIRED_EVENT_CATEGORY = "REQUIRED_EVENT_CATEGORY"
    CUSTOM = "CUSTOM"

class AwardCriteria(Base):
    __tablename__ = "award_criteria"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    type = Column(Enum(CriteriaType), nullable=False)
    value = Column(String, nullable=False)
    is_required = Column(Boolean, default=True)
    description = Column(Text, nullable=True)

class AwardPeriod(Base):
    __tablename__ = "award_periods"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    code = Column(String, unique=True, index=True, nullable=False) # e.g. SV5T-2026-2027
    name = Column(String, nullable=False) # e.g. Xét chọn Danh hiệu Sinh viên 5 Tốt 2026-2027
    year = Column(Integer, nullable=False) # 2026
    description = Column(Text, nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    submission_deadline = Column(DateTime(timezone=True), nullable=False)
    decision_file_url = Column(String, nullable=True)
    quotas = Column(JSONB, nullable=True)
    status = Column(String(50), default="UPCOMING", nullable=False)
    
    standards = relationship("AwardStandard", back_populates="period", cascade="all, delete-orphan")
    applications = relationship("Award", back_populates="period")

class AwardStandard(Base):
    __tablename__ = "award_standards"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    period_id = Column(UUID(as_uuid=True), ForeignKey("award_periods.id", ondelete="CASCADE"), nullable=True)
    criteria_name = Column(String, nullable=False) # 1. Đạo đức tốt, 2. Học tập tốt, 3. Thể lực tốt, 4. Tình nguyện tốt, 5. Hội nhập tốt
    title = Column(String, nullable=False) # Nội dung tiêu chuẩn
    evidence_requirement = Column(Text, nullable=True) # Yêu cầu minh chứng
    document_reference = Column(Text, nullable=True) # Văn bản hướng dẫn nếu có
    rule_type = Column(String(50), default="REQUIRED", nullable=False) # REQUIRED or GROUP_SELECT
    group_code = Column(String, nullable=True) # Nhóm lựa chọn con
    group_name = Column(String, nullable=True) # VD: "Chọn ít nhất 1 trong 3"
    min_select_count = Column(Integer, default=1)
    order_num = Column(Integer, default=0)
    
    period = relationship("AwardPeriod", back_populates="standards")
    application_items = relationship("AwardApplicationItem", back_populates="standard")

class Award(Base):
    """
    Bảng chính lưu Hồ sơ đề nghị khen thưởng / Xét chọn SV5T.
    Tương thích ngược với Award cũ và hỗ trợ đầy đủ các trường mới.
    """
    __tablename__ = "awards"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_code = Column(String, unique=True, index=True, nullable=True) # HS-2026-001
    period_id = Column(UUID(as_uuid=True), ForeignKey("award_periods.id"), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    created_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=True)
    target_type = Column(String(50), default="INDIVIDUAL", nullable=False) # INDIVIDUAL, COLLECTIVE
    
    # Nhóm 1: Thông tin cá nhân
    full_name = Column(String, nullable=True)
    address = Column(String, nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String, nullable=True)
    cccd = Column(String, nullable=True)
    ethnicity = Column(String, nullable=True) # Dân tộc (Kinh, ...)
    religion = Column(String, nullable=True) # Tôn giáo (Không, ...)
    
    # Nhóm 2: Thông tin học tập
    student_code = Column(String, nullable=True) # MSSV
    academic_year_num = Column(Integer, nullable=True) # Năm thứ 1, 2, 3...
    school_name = Column(String, nullable=True) # Trường Đại học Lạc Hồng...
    faculty_name = Column(String, nullable=True) # Khoa Công nghệ Thông tin...
    class_name = Column(String, nullable=True) # Lớp 21CT111...
    education_level = Column(String, nullable=True) # Đại học / Cao đẳng
    gpa = Column(Float, nullable=True) # Điểm học tập
    training_score = Column(Integer, nullable=True) # Điểm rèn luyện
    
    # Nhóm 3: Đoàn - Hội & Liên hệ
    union_position = Column(String, nullable=True) # Bí thư Chi đoàn...
    political_status = Column(String, nullable=True) # Đảng viên / Đoàn viên / Khác
    phone_number = Column(String, nullable=True)
    email = Column(String, nullable=True)
    
    # Thành tích & Cam kết
    achievement_summary = Column(Text, nullable=True)
    legal_commitment = Column(Boolean, default=False)
    is_late_submission = Column(Boolean, default=False)
    
    # Legacy fields
    award_name = Column(String, default="Danh hiệu Sinh viên 5 Tốt", nullable=True)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="DRAFT", nullable=False)
    decision_number = Column(String, nullable=True)
    awarded_date = Column(Date, nullable=True)
    points = Column(Integer, default=0)
    assessment = Column(JSONB, nullable=True)
    screening_results = Column(JSONB, nullable=True)
    evidence_url = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id], backref="awards")
    creator = relationship("User", foreign_keys=[created_by_id])
    organization = relationship("Organization", foreign_keys=[organization_id])
    period = relationship("AwardPeriod", back_populates="applications")
    items = relationship("AwardApplicationItem", back_populates="application", cascade="all, delete-orphan")
    histories = relationship("AwardApprovalHistory", back_populates="application", cascade="all, delete-orphan")

# Alias for clarity
AwardApplication = Award

class AwardApplicationItem(Base):
    __tablename__ = "award_application_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("awards.id", ondelete="CASCADE"), nullable=False)
    standard_id = Column(UUID(as_uuid=True), ForeignKey("award_standards.id", ondelete="SET NULL"), nullable=True)
    is_selected = Column(Boolean, default=False)
    explanation = Column(Text, nullable=True)
    evidence_files = Column(JSONB, nullable=True) # [{"name": "minh_chung.pdf", "url": "https://..."}]
    eval_status = Column(String(50), nullable=True) # PASSED, FAILED, null
    eval_note = Column(Text, nullable=True)
    is_temp_saved = Column(Boolean, default=False)
    
    application = relationship("Award", back_populates="items")
    standard = relationship("AwardStandard", back_populates="application_items")

class AwardApprovalHistory(Base):
    __tablename__ = "award_approval_histories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("awards.id", ondelete="CASCADE"), nullable=False)
    action = Column(String, nullable=False) # Nộp hồ sơ, Bổ sung hồ sơ, Góp ý chỉnh sửa, Trả lại hồ sơ, Xác nhận hồ sơ, Phê duyệt hồ sơ, Từ chối hồ sơ
    from_status = Column(String(50), nullable=True)
    to_status = Column(String(50), nullable=True)
    actor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    actor_name = Column(String, nullable=True)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now(), server_default=func.now())
    
    application = relationship("Award", back_populates="histories")
    actor = relationship("User", foreign_keys=[actor_id])
