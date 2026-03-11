from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    users,
    roles,
    permissions,
    organizations,
    academic_terms,
    campaigns,
    events,
    budgets,
    fund_requests,
    assets,
    asset_loans,
    ai_sentiments,
    ai_predictions,
    chatbot_logs,
    ai_audits,
    audit_logs
)

api_router = APIRouter()

# Authentication
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# Phase 1
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(roles.router, prefix="/roles", tags=["Roles"])
api_router.include_router(permissions.router, prefix="/permissions", tags=["Permissions"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["Organizations"])
api_router.include_router(academic_terms.router, prefix="/academic-terms", tags=["Academic Terms"])

# Phase 2
api_router.include_router(campaigns.router, prefix="/campaigns", tags=["Campaigns"])
api_router.include_router(events.router, prefix="/events", tags=["Events"])

# Phase 3
api_router.include_router(budgets.router, prefix="/budgets", tags=["Budgets"])
api_router.include_router(fund_requests.router, prefix="/fund-requests", tags=["Fund Requests"])
api_router.include_router(assets.router, prefix="/assets", tags=["Assets"])
api_router.include_router(asset_loans.router, prefix="/asset-loans", tags=["Asset Loans"])

# Phase 4
api_router.include_router(ai_sentiments.router, prefix="/ai-sentiments", tags=["AI Sentiments"])
api_router.include_router(ai_predictions.router, prefix="/ai-predictions", tags=["AI Predictions"])
api_router.include_router(chatbot_logs.router, prefix="/chatbot-logs", tags=["Chatbot Logs"])
api_router.include_router(ai_audits.router, prefix="/ai-audits", tags=["AI Audits"])
api_router.include_router(audit_logs.router, prefix="/audit-logs", tags=["System Audit Logs"])
