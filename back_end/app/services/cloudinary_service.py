import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from app.core.config import settings

# Configuration 
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

def get_cloudinary_folder(user=None, category="avatar"):
    """
    Generate a hierarchical folder path for Cloudinary.
    Structure: {category} / {role} / Khóa {batch} / {class}
    
    :param user: User model instance
    :param category: The top-level category (e.g., 'avatar', 'documents')
    :return: Folder path string
    """
    if not user:
        return category

    # 1. Determine Role
    role_names = [r.name.upper() for r in user.roles]
    if "ADMIN" in role_names:
        role_folder = "admin"
    elif any(r in role_names for r in ["UNIVERSITY_ADMIN", "FACULTY_ADMIN"]):
        role_folder = "subadmin"
    else:
        role_folder = "user"

    # 2. Determine Batch (Khóa) - Assume first 2 digits of student_id
    batch_folder = "Unknown"
    if user.student_id and len(user.student_id) >= 2:
        batch_digits = user.student_id[:2]
        if batch_digits.isdigit():
            batch_folder = f"Khóa {batch_digits}"

    # 3. Determine Class (Lớp)
    class_folder = "Chưa xếp lớp"
    if user.organizations:
        for uo in user.organizations:
            if uo.organization and uo.organization.type.value == "CLASS":
                class_folder = uo.organization.name
                break
    
    return f"{category}/{role_folder}/{batch_folder}/{class_folder}"

def upload_image(file, folder=None, user=None, category="avatar"):
    """
    Upload an image to Cloudinary with hierarchical folder support.
    
    :param file: The file to upload
    :param folder: Optional explicit folder path. If provided, overrides dynamic logic.
    :param user: User instance for dynamic folder generation
    :param category: Top-level category for dynamic folder generation
    :return: Dictionary with upload result
    """
    if not folder:
        folder = get_cloudinary_folder(user, category)
        
    try:
        upload_result = cloudinary.uploader.upload(file, folder=folder)
        return {
            "url": upload_result.get("secure_url"),
            "public_id": upload_result.get("public_id"),
            "folder": folder,
            "success": True
        }
    except Exception as e:
        return {
            "error": str(e),
            "success": False
        }

def get_image_url(public_id, **options):
    """
    Generate a Cloudinary URL for a public_id.
    :param public_id: The public ID of the image
    :param options: Transformation options (e.g., width, height, crop)
    :return: The generated URL
    """
    url, _ = cloudinary_url(public_id, **options)
    return url

def delete_image(public_id):
    """
    Delete an image from Cloudinary.
    :param public_id: The public ID of the image
    :return: Dictionary with result
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        return {
            "result": result.get("result"),
            "success": result.get("result") == "ok"
        }
    except Exception as e:
        return {
            "error": str(e),
            "success": False
        }
