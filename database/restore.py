import os
import subprocess
from urllib.parse import urlparse
from dotenv import load_dotenv

def restore_database():
    # Path to .env file in the back_end directory
    env_path = os.path.join(os.path.dirname(__file__), '..', 'back_end', '.env')
    load_dotenv(env_path)

    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("Error: DATABASE_URL not found in .env file.")
        return

    # Parse connection string
    # Format: postgresql://user:password@host:port/dbname
    result = urlparse(db_url)
    username = result.username
    password = result.password
    database = result.path.lstrip('/')
    hostname = result.hostname
    port = result.port or 5432

    backup_file = os.path.join(os.path.dirname(__file__), 'backup.sql')

    if not os.path.exists(backup_file):
        print(f"Error: Backup file not found at {backup_file}")
        return

    print(f"Restoring database '{database}' from '{backup_file}'...")

    # Set password for pg_restore (standard way to pass password to PostgreSQL CLI tools)
    env = os.environ.copy()
    if password:
        env["PGPASSWORD"] = password

    def find_pg_restore():
        # 1. Try if it's already in PATH
        import shutil
        path = shutil.which("pg_restore")
        if path:
            return path

        # 2. Check common Windows paths
        common_paths = [
            r"C:\Program Files\PostgreSQL\17\bin\pg_restore.exe",
            r"C:\Program Files\PostgreSQL\16\bin\pg_restore.exe",
            r"C:\Program Files\PostgreSQL\15\bin\pg_restore.exe",
            r"C:\Program Files\PostgreSQL\14\bin\pg_restore.exe",
        ]
        for p in common_paths:
            if os.path.exists(p):
                return p
        return "pg_restore" # Fallback to default and let it fail with a clear error

    import psycopg2
    try:
        print("Cleaning database schema...")
        conn = psycopg2.connect(
            dbname=database,
            user=username,
            password=password,
            host=hostname,
            port=port
        )
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute("DROP SCHEMA public CASCADE;")
        cur.execute("CREATE SCHEMA public;")
        cur.execute("GRANT ALL ON SCHEMA public TO postgres;")
        cur.execute("GRANT ALL ON SCHEMA public TO public;")
        cur.close()
        conn.close()
        print("Schema cleaned successfully.")
    except Exception as e:
        print(f"Warning: Could not clean schema automatically: {e}")
        print("Attempting to proceed with standard pg_restore...")

    pg_restore_path = find_pg_restore()
    
    # Construct pg_restore command
    # We removed --clean and --if-exists because we manually cleaned the schema
    command = [
        pg_restore_path,
        "-h", hostname,
        "-p", str(port),
        "-U", username,
        "-d", database,
        "--no-owner",
        "--no-privileges",
        backup_file
    ]

    try:
        # Run the command and let it output directly to the terminal
        subprocess.run(command, env=env, check=True)
        print("Success: Database restored successfully!")
    except FileNotFoundError:
        print("Error: 'pg_restore' không tìm thấy. Hãy đảm bảo PostgreSQL đã được cài đặt.")
        print("Gợi ý: Kiểm tra đường dẫn C:\\Program Files\\PostgreSQL\\17\\bin")
    except subprocess.CalledProcessError as e:
        print("Error: Restore database thất bại.")
        print(f"Exit code: {e.returncode}")

if __name__ == "__main__":
    restore_database()

