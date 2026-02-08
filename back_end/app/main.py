from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.models import User, Event, notification, certificate
from app.api.v1 import auth, events, dashboard, users, notifications, transactions, achievements, ai_analysis, system, ranking, certificates
from app.api.v1 import dashboard_sub
from app.db.session import engine, Base
from app.models.user import User
from app.models.event import Event
from app.models.participation import Participation # Thêm dòng này
from app.models.achievement import Achievement     # Thêm dòng này
from app.models.certificate import Certificate



Base.metadata.create_all(bind=engine)
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)
# Cấu hình CORS (Giữ nguyên như cũ)
origins = [
    "http://localhost",
    "http://localhost:3000",      # React mặc định
    "http://127.0.0.1:3000",
    "http://localhost:5173",      # Vite/Vue mặc định
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # Cho phép các nguồn này gọi API
    allow_credentials=True,
    allow_methods=["*"],          # Cho phép tất cả các phương thức (GET, POST, DELETE...)
    allow_headers=["*"],          # Cho phép tất cả headers
)

# --- THÊM DÒNG NÀY: Kết nối API đăng ký vào hệ thống ---
# Khi người dùng gọi /api/v1/register -> Nó sẽ chạy vào file auth.py
# app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(events.router, prefix="/api/v1/events", tags=["Events"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(transactions.router, prefix="/api/v1/transactions", tags=["transactions"])
app.include_router(achievements.router, prefix="/api/v1/achievements", tags=["achievements"])
app.include_router(ai_analysis.router, prefix="/api/v1/ai", tags=["ai"])
app.include_router(system.router, prefix="/api/v1/system", tags=["system"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(ranking.router, prefix="/api/v1/ranking", tags=["Ranking"])
app.include_router(certificates.router, prefix="/api/v1/certificates", tags=["Certificates"])
app.include_router(dashboard_sub.router, prefix="/api/v1/sub-dashboard", tags=["Sub Dashboard"])

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def root():
    return {"message": "Welcome to LHU YouthHub API"}