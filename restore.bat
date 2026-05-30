@echo off
echo ==========================================
echo   FlameGuard AI - Database Restore
echo ==========================================
echo WARNING: This will overwrite your current database data!
set /p confirm="Are you sure you want to proceed? (y/n): "
if /i "%confirm%" neq "y" goto end

python database\restore_db.py

:end
pause
