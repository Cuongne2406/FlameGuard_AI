import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FlameGuard AI API"
    
    # DATABASE
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "flameguard_db")
    POSTGRES_PORT: str = "5432"

    from pydantic import Field
    SQLALCHEMY_DATABASE_URI: str = Field(
        default="postgresql://postgres:postgres@localhost:5432/flameguard_db",
        validation_alias="DATABASE_URL"
    )
    
    # JWT Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-it-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "allow" # Allows extra env variables like SECRET_KEY and MAIL_USERNAME without crashing

settings = Settings()
