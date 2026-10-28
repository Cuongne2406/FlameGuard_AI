from app.db.base_class import Base
from app.models.core import (
    User, Role, Permission, Organization, UserOrganization, AcademicTerm,
    ClubProposal, PointCategory, PointLog, UserSkill, UserExperience,
    role_permissions, user_roles
)
from app.models.events import (
    Campaign, Event, EventRegistration, EventFeedback, EventQA, EventIncident
)
from app.models.finance import (
    Budget, FundRequest, Asset, AssetLoan, FinanceTransaction, StudentFee
)
from app.models.ai import AISentiment, AIPrediction, AIAudit, ChatbotLog
from app.models.audit import AuditLog
from app.models.awards import (
    Award, AwardApplication, AwardCriteria, AwardPeriod, AwardStandard,
    AwardApplicationItem, AwardApprovalHistory, AwardStatus, AwardPeriodStatus, StandardRuleType
)
from app.models.documents import DigitalDocument
from app.models.notifications import Notification
from app.models.settings import SystemSetting
from app.models.news import News

# Expose Base and all models here for Alembic correctly detecting them
__all__ = [
    "Base",
    "User", "Role", "Permission", "Organization", "UserOrganization", "AcademicTerm",
    "ClubProposal", "PointCategory", "PointLog", "UserSkill", "UserExperience",
    "role_permissions", "user_roles",
    "Campaign", "Event", "EventRegistration", "EventFeedback", "EventQA", "EventIncident",
    "Budget", "FundRequest", "Asset", "AssetLoan", "FinanceTransaction", "StudentFee",
    "AISentiment", "AIPrediction", "AIAudit", "ChatbotLog", "AuditLog",
    "Award", "AwardApplication", "AwardCriteria", "AwardPeriod", "AwardStandard",
    "AwardApplicationItem", "AwardApprovalHistory", "AwardStatus", "AwardPeriodStatus", "StandardRuleType",
    "DigitalDocument", "Notification", "SystemSetting", "News"
]