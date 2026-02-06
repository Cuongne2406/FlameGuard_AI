from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.models import User, Event 
from app.api.v1 import auth 
from app.api.v1 import auth, events

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)
# --- THÊM DÒNG NÀY: Import cái file auth bạn vừa viết ---


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Cấu hình CORS (Giữ nguyên như cũ)
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- THÊM DÒNG NÀY: Kết nối API đăng ký vào hệ thống ---
# Khi người dùng gọi /api/v1/register -> Nó sẽ chạy vào file auth.py
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(events.router, prefix="/api/v1/events", tags=["Events"])

@app.get("/")
def root():
    return {"message": "Welcome to LHU YouthHub API"}