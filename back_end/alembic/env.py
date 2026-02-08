import sys
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

from app.db.session import Base
from app.models.user import User
from app.models.notification import Notification


# --- QUAN TRỌNG: Thêm đường dẫn dự án vào hệ thống để import được app ---
sys.path.append(os.getcwd())

# Import Settings từ FastAPI
from app.core.config import settings
from app.db.session import Base
from app.models.user import User
from app.models.event import Event
from app.models.transaction import Transaction
from app.models.access_log import AccessLog
from app.models.system_setting import SystemSetting


config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_online() -> None:
    # --- CƯỠNG CHẾ: Lấy URL từ settings của FastAPI ---
    # Dòng này sẽ ghi đè cái "driver://..." trong file .ini
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = settings.DATABASE_URL
    
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

def run_migrations_offline() -> None:
    # Cũng dùng URL từ settings cho mode offline
    url = settings.DATABASE_URL
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()