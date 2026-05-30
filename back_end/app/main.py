from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.middleware.ip_whitelist import IPWhitelistMiddleware

from app.db.session import engine
from app.models import Base

# Auto-create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FlameGuard AI API",
    description="Enterprise API Core for DYUS Management",
    version="1.0.0"
)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(IPWhitelistMiddleware)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to FlameGuard AI Enterprise API"}
