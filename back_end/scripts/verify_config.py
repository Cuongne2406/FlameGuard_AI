import os
import sys

# Add app directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from app.core.config import settings
    print(f"PROJECT_NAME: {settings.PROJECT_NAME}")
    print(f"CLOUDINARY_CLOUD_NAME: {settings.CLOUDINARY_CLOUD_NAME}")
    print(f"CLOUDINARY_API_KEY: {settings.CLOUDINARY_API_KEY}")
    print(f"CLOUDINARY_API_SECRET: {'*' * len(settings.CLOUDINARY_API_SECRET) if settings.CLOUDINARY_API_SECRET else 'None'}")
except Exception as e:
    print(f"Error: {e}")
