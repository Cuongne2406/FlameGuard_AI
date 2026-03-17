from sqlalchemy.orm import Session
from uuid import UUID
from fastapi import HTTPException
from app.models.core import User, Role, Permission, Organization, AcademicTerm
from app.schemas.core_schemas import (
    UserCreate, UserUpdate,
    RoleCreate, RoleUpdate,
    PermissionCreate, PermissionUpdate,
    OrganizationCreate, OrganizationUpdate, OrganizationResponse,
    AcademicTermCreate, AcademicTermUpdate,
    UserOrganizationCreate
)
from app.core.security import get_password_hash
from app.services import ai_audit_service
from app.schemas.ai_audit_schemas import AuditLogCreate
from datetime import datetime

# ==========================================
# Permission Services
# ==========================================
def create_permission(db: Session, perm_in: PermissionCreate):
    db_perm = Permission(**perm_in.dict())
    db.add(db_perm)
    db.commit()
    db.refresh(db_perm)
    return db_perm

def get_permissions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Permission).offset(skip).limit(limit).all()

def update_permission(db: Session, perm_id: UUID, perm_in: PermissionUpdate):
    db_perm = db.query(Permission).filter(Permission.id == perm_id).first()
    if not db_perm:
        raise HTTPException(status_code=404, detail="Permission not found")
    
    update_data = perm_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_perm, key, value)
        
    db.commit()
    db.refresh(db_perm)
    return db_perm

def delete_permission(db: Session, perm_id: UUID):
    db_perm = db.query(Permission).filter(Permission.id == perm_id).first()
    if not db_perm:
        raise HTTPException(status_code=404, detail="Permission not found")
    db.delete(db_perm)
    db.commit()
    return {"message": "Permission deleted successfully"}


# ==========================================
# Role Services
# ==========================================
def create_role(db: Session, role_in: RoleCreate):
    db_role = Role(name=role_in.name, description=role_in.description)
    
    if role_in.permission_ids:
        permissions = db.query(Permission).filter(Permission.id.in_(role_in.permission_ids)).all()
        db_role.permissions = permissions
        
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    
    # Ghi nhật ký: Tạo vai trò mới
    ai_audit_service.create_system_audit_log(db, AuditLogCreate(
        action="CREATE_ROLE",
        entity_type="Role",
        entity_id=db_role.id,
        created_at=datetime.now()
    ))
    
    return db_role

def get_roles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Role).offset(skip).limit(limit).all()

def update_role(db: Session, role_id: UUID, role_in: RoleUpdate):
    db_role = db.query(Role).filter(Role.id == role_id).first()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    if role_in.name is not None:
        db_role.name = role_in.name
    if role_in.description is not None:
        db_role.description = role_in.description
        
    if role_in.permission_ids is not None:
        permissions = db.query(Permission).filter(Permission.id.in_(role_in.permission_ids)).all()
        db_role.permissions = permissions
        
    db.commit()
    db.refresh(db_role)
    
    # Ghi nhật ký: Cập nhật vai trò
    ai_audit_service.create_system_audit_log(db, AuditLogCreate(
        action="UPDATE_ROLE",
        entity_type="Role",
        entity_id=db_role.id,
        created_at=datetime.now()
    ))
    
    return db_role

def delete_role(db: Session, role_id: UUID):
    db_role = db.query(Role).filter(Role.id == role_id).first()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    db.delete(db_role)
    db.commit()
    
    # Ghi nhật ký: Xóa vai trò
    ai_audit_service.create_system_audit_log(db, AuditLogCreate(
        action="DELETE_ROLE",
        entity_type="Role",
        entity_id=role_id,
        created_at=datetime.now()
    ))
    
    return {"message": "Role deleted successfully"}


# ==========================================
# Organization Services
# ==========================================
def create_organization(db: Session, org_in: OrganizationCreate):
    db_org = Organization(**org_in.dict())
    db.add(db_org)
    db.commit()
    db.refresh(db_org)
    return db_org

def get_organizations(db: Session, skip: int = 0, limit: int = 100):
    orgs = db.query(Organization).offset(skip).limit(limit).all()
    results = []
    
    for org in orgs:
        # Get primary leader
        from app.models.core import UserOrganization, User
        leader_info = db.query(User.full_name, User.student_id)\
            .join(UserOrganization, User.id == UserOrganization.user_id)\
            .filter(UserOrganization.organization_id == org.id, UserOrganization.is_primary == True)\
            .first()
            
        total_members = db.query(UserOrganization).filter(UserOrganization.organization_id == org.id).count()
        
        org_data = OrganizationResponse.model_validate(org).model_dump()
        if leader_info:
            org_data["leader_name"] = leader_info.full_name
            org_data["leader_student_id"] = leader_info.student_id
        org_data["total_members"] = total_members
        results.append(org_data)
        
    return results

def update_organization(db: Session, org_id: UUID, org_in: OrganizationUpdate):
    db_org = db.query(Organization).filter(Organization.id == org_id).first()
    if not db_org:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    update_data = org_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_org, key, value)
        
    db.commit()
    db.refresh(db_org)
    return db_org

def delete_organization(db: Session, org_id: UUID):
    db_org = db.query(Organization).filter(Organization.id == org_id).first()
    if not db_org:
        raise HTTPException(status_code=404, detail="Organization not found")
    db.delete(db_org)
    db.commit()
    return {"message": "Organization deleted successfully"}

def assign_member_to_org(db: Session, assign_in: UserOrganizationCreate):
    from app.models.core import UserOrganization
    
    # Check if user and org exist
    user = db.query(User).filter(User.id == assign_in.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    org = db.query(Organization).filter(Organization.id == assign_in.organization_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    # If this is a primary assignment, unset previous primary for this org
    if assign_in.is_primary:
        db.query(UserOrganization)\
            .filter(UserOrganization.organization_id == assign_in.organization_id, UserOrganization.is_primary == True)\
            .update({"is_primary": False})

    # Check if this user is already in this org
    db_assign = db.query(UserOrganization).filter(
        UserOrganization.user_id == assign_in.user_id,
        UserOrganization.organization_id == assign_in.organization_id
    ).first()

    if db_assign:
        # Update existing
        update_data = assign_in.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_assign, key, value)
    else:
        # Create new
        db_assign = UserOrganization(**assign_in.dict())
        db.add(db_assign)
        
    db.commit()
    db.refresh(db_assign)
    return db_assign


# ==========================================
# Academic Term Services
# ==========================================
def create_academic_term(db: Session, term_in: AcademicTermCreate):
    db_term = AcademicTerm(**term_in.dict())
    db.add(db_term)
    db.commit()
    db.refresh(db_term)
    return db_term

def get_academic_terms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(AcademicTerm).offset(skip).limit(limit).all()

def update_academic_term(db: Session, term_id: UUID, term_in: AcademicTermUpdate):
    db_term = db.query(AcademicTerm).filter(AcademicTerm.id == term_id).first()
    if not db_term:
        raise HTTPException(status_code=404, detail="Academic Term not found")
    
    update_data = term_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_term, key, value)
        
    db.commit()
    db.refresh(db_term)
    return db_term

def delete_academic_term(db: Session, term_id: UUID):
    db_term = db.query(AcademicTerm).filter(AcademicTerm.id == term_id).first()
    if not db_term:
        raise HTTPException(status_code=404, detail="Academic Term not found")
    db.delete(db_term)
    db.commit()
    return {"message": "Academic Term deleted successfully"}


# ==========================================
# User Services
# ==========================================
def create_user(db: Session, user_in: UserCreate):
    # Check if email exists
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Check if student_id exists
    if user_in.student_id and db.query(User).filter(User.student_id == user_in.student_id).first():
        raise HTTPException(status_code=400, detail="Student ID already registered")

    db_user = User(
        student_id=user_in.student_id,
        full_name=user_in.full_name,
        email=user_in.email,
        phone_number=user_in.phone_number,
        status=user_in.status,
        avatar_url=user_in.avatar_url,
        password_hash=get_password_hash(user_in.password) if user_in.password else None
    )
    
    if user_in.role_ids:
        roles = db.query(Role).filter(Role.id.in_(user_in.role_ids)).all()
        db_user.roles = roles

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    users = db.query(User).offset(skip).limit(limit).all()
    results = []
    
    for user in users:
        # Tính toán role_title (ưu tiên vị trí chính)
        role_title = "Thành viên"
        org_data_list = []
        
        for uo in user.organizations:
            org_data_list.append({
                "organization_id": uo.organization_id,
                "organization_name": uo.organization.name,
                "title": uo.title,
                "is_primary": uo.is_primary
            })
            if uo.is_primary:
                role_title = uo.title
        
        # Nếu chưa có primary role nhưng có đơn vị, lấy role đầu tiên
        if role_title == "Thành viên" and org_data_list:
            role_title = org_data_list[0]["title"] or "Cán bộ"
        
        # Chuyển đổi sang dict và thêm các trường động
        user_dict = {
            "id": str(user.id),
            "student_id": user.student_id,
            "full_name": user.full_name,
            "email": user.email,
            "phone_number": user.phone_number,
            "status": user.status.value if user.status else "ACTIVE",
            "avatar_url": user.avatar_url,
            "level": user.level,
            "training_score": user.training_score,
            "university": user.university,
            "address": user.address,
            "role_title": role_title,
            "organizations": org_data_list,
            "roles": [
                {
                    "id": str(r.id),
                    "name": r.name,
                    "description": r.description
                } for r in user.roles
            ],
            "last_login_at": user.last_login_at.isoformat() if user.last_login_at else None
        }
        results.append(user_dict)
        
    return results

def update_user(db: Session, user_id: UUID, user_in: UserUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = user_in.dict(exclude_unset=True)
    
    if "role_ids" in update_data:
        roles = db.query(Role).filter(Role.id.in_(update_data.pop("role_ids"))).all()
        db_user.roles = roles
        
    if "password" in update_data:
        db_user.password_hash = get_password_hash(update_data.pop("password"))

    for key, value in update_data.items():
        setattr(db_user, key, value)
        
    db.commit()
    db.refresh(db_user)
    
    # Ghi nhật ký: Cập nhật người dùng (bao gồm gán vai trò)
    ai_audit_service.create_system_audit_log(db, AuditLogCreate(
        action="UPDATE_USER",
        entity_type="User",
        entity_id=db_user.id,
        created_at=datetime.now()
    ))
    
    return db_user

def delete_user(db: Session, user_id: UUID):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}
