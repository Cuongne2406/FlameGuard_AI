import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter()

# --- CẤU HÌNH CLOUDINARY ---
# Hãy thay thế bằng thông tin thật bạn vừa lấy được
cloudinary.config( 
  cloud_name = "dnl63zemy", 
  api_key = "674724551254934", 
  api_secret = "jpci-g5l0hpl8vve4VVyX4yJ6fM",
  secure = True
)

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Upload trực tiếp file lên Cloudinary
        # folder="youthhub_events": Tự động tạo thư mục tên này để chứa ảnh
        result = cloudinary.uploader.upload(file.file, folder="youthhub_events")

        # Lấy link ảnh HTTPS an toàn
        image_url = result.get("secure_url")

        return {
            "status": "success",
            "direct_link": image_url 
        }

    except Exception as e:
        print(f"LỖI UPLOAD CLOUDINARY: {str(e)}")
        raise HTTPException(status_code=500, detail="Lỗi upload ảnh lên Cloudinary")