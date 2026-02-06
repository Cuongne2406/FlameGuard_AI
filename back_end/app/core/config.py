import os
from pydantic_settings import BaseSettings
from pathlib import Path

# Trỏ về thư mục back_end (nơi chứa file .env)
# __file__ là file config.py -> parent (core) -> parent (app) -> parent (back_end)
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "LHU YouthHub API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "secret_key_tam_thoi")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 11520
    
    # Nếu không tìm thấy trong .env, nó sẽ báo lỗi ngay lập tức để mình biết
    DATABASE_URL: str 

    class Config:
        case_sensitive = True
        # Dùng đường dẫn tuyệt đối tới file .env
        env_file = str(BASE_DIR / ".env")
        extra = "ignore"

settings = Settings()