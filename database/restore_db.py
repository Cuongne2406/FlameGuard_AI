import os
import subprocess
from pathlib import Path

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
BACKEND_DIR = PROJECT_ROOT / "back_end"
ENV_FILE = BACKEND_DIR / ".env"
BACKUP_FILE = PROJECT_ROOT / "database" / "full_backup.sql"

def get_env_variable(key, default=None):
    if not ENV_FILE.exists():
        return default
    with open(ENV_FILE, "r") as f:
        for line in f:
            if line.startswith(f"{key}="):
                return line.strip().split("=", 1)[1]
    return default

def find_pg_tool(tool_name):
    try:
        subprocess.run([tool_name, "--version"], capture_output=True, check=True)
        return tool_name
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass

    base_path = Path("C:/Program Files/PostgreSQL")
    if base_path.exists():
        versions = sorted([d for d in base_path.iterdir() if d.is_dir()], reverse=True)
        for v in versions:
            tool_path = v / "bin" / f"{tool_name}.exe"
            if tool_path.exists():
                return str(tool_path)
    
    return tool_name

def restore():
    if not BACKUP_FILE.exists():
        print(f"Error: Backup file not found at {BACKUP_FILE}")
        return

    db_url = get_env_variable("DATABASE_URL")
    if not db_url:
        print("Error: DATABASE_URL not found in .env")
        return

    try:
        parts = db_url.replace("postgresql://", "").split("@")
        user_pass = parts[0].split(":")
        host_port_db = parts[1].split("/")
        
        user = user_pass[0]
        password = user_pass[1]
        host_port = host_port_db[0].split(":")
        host = host_port[0]
        port = host_port[1] if len(host_port) > 1 else "5432"
        dbname = host_port_db[1]
    except Exception as e:
        print(f"Error parsing DATABASE_URL: {e}")
        return

    psql = find_pg_tool("psql")
    print(f"Using {psql} to restore {dbname}...")

    os.environ["PGPASSWORD"] = password

    # 1. Terminate other connections to the database to allow dropping
    print("Terminating existing connections...")
    terminate_cmd = [
        psql,
        "-h", host,
        "-p", port,
        "-U", user,
        "-d", "postgres",
        "-c", f"SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '{dbname}' AND pid <> pg_backend_pid();"
    ]
    subprocess.run(terminate_cmd, capture_output=True)

    # 2. Drop and recreate database for a clean restore
    print(f"Recreating database {dbname}...")
    drop_cmd = [psql, "-h", host, "-p", port, "-U", user, "-d", "postgres", "-c", f"DROP DATABASE IF EXISTS {dbname};"]
    create_cmd = [psql, "-h", host, "-p", port, "-U", user, "-d", "postgres", "-c", f"CREATE DATABASE {dbname};"]
    
    try:
        subprocess.run(drop_cmd, check=True)
        subprocess.run(create_cmd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error recreating database: {e}")
        # Continue anyway, maybe it's already empty or we can't drop it

    # 3. Restore from SQL file
    print(f"Restoring data from {BACKUP_FILE}...")
    restore_cmd = [
        psql,
        "-h", host,
        "-p", port,
        "-U", user,
        "-d", dbname,
        "-f", str(BACKUP_FILE)
    ]

    try:
        subprocess.run(restore_cmd, check=True)
        print(f"\nRestore successful!")
    except subprocess.CalledProcessError as e:
        print(f"\nRestore failed: {e}")
    finally:
        if "PGPASSWORD" in os.environ:
            del os.environ["PGPASSWORD"]

if __name__ == "__main__":
    restore()
