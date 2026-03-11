from sqlalchemy.orm import Session
from uuid import UUID
from fastapi import HTTPException
from app.models.core import User, Role, Permission, Organization, AcademicTerm
from app.schemas.core_schemas import (
    UserCreate, UserUpdate,
    RoleCreate, RoleUpdate,
    PermissionCreate, PermissionUpdate,
    OrganizationCreate, OrganizationUpdate,
    AcademicTermCreate, AcademicTermUpdate
)
from app.core.security import get_password_hash

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
    return db_role

def delete_role(db: Session, role_id: UUID):
    db_role = db.query(Role).filter(Role.id == role_id).first()
    if not db_role:
        raise HTTPException(status_code=404, detail="Role not found")
    db.delete(db_role)
    db.commit()
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
    return db.query(Organization).offset(skip).limit(limit).all()

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
    return db.query(User).offset(skip).limit(limit).all()

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
    return db_user

def delete_user(db: Session, user_id: UUID):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}
