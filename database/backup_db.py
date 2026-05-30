import os
import subprocess
from datetime import datetime
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
    """Try to find pg_dump or psql in common locations if not in PATH."""
    # Check if already in PATH
    try:
        subprocess.run([tool_name, "--version"], capture_output=True, check=True)
        return tool_name
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass

    # Common Windows installation paths
    base_path = Path("C:/Program Files/PostgreSQL")
    if base_path.exists():
        versions = sorted([d for d in base_path.iterdir() if d.is_dir()], reverse=True)
        for v in versions:
            tool_path = v / "bin" / f"{tool_name}.exe"
            if tool_path.exists():
                return str(tool_path)
    
    return tool_name  # Fallback to just the name and hope for the best

def backup():
    db_url = get_env_variable("DATABASE_URL")
    if not db_url:
        print("Error: DATABASE_URL not found in .env")
        return

    # Parse URL: postgresql://user:password@host:port/dbname
    # Simple parsing for standard format
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

    pg_dump = find_pg_tool("pg_dump")
    print(f"Using {pg_dump} to backup {dbname}...")

    # Set password for pg_dump
    os.environ["PGPASSWORD"] = password

    cmd = [
        pg_dump,
        "-h", host,
        "-p", port,
        "-U", user,
        "-F", "p",  # Plain text SQL
        "-b",       # Include large objects
        "-v",       # Verbose
        "-f", str(BACKUP_FILE),
        dbname
    ]

    try:
        subprocess.run(cmd, check=True)
        print(f"\nBackup successful! File saved to: {BACKUP_FILE}")
    except subprocess.CalledProcessError as e:
        print(f"\nBackup failed: {e}")
    finally:
        if "PGPASSWORD" in os.environ:
            del os.environ["PGPASSWORD"]

if __name__ == "__main__":
    backup()
