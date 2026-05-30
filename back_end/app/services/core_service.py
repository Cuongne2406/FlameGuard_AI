from sqlalchemy.orm import Session
from uuid import UUID
from fastapi import HTTPException
from app.models.core import User, Role, Permission, Organization, AcademicTerm, UserOrganization, OrgType, ClubProposal, OrgStatus
from app.schemas.core_schemas import (
    UserCreate, UserUpdate,
    RoleCreate, RoleUpdate,
    PermissionCreate, PermissionUpdate,
    OrganizationCreate, OrganizationUpdate, OrganizationResponse,
    AcademicTermCreate, AcademicTermUpdate,
    UserOrganizationCreate,
    ClubProposalCreate
)
from sqlalchemy import func
from app.core.security import get_password_hash
from app.services import ai_audit_service, notification_service
from app.schemas.ai_audit_schemas import AuditLogCreate
from app.schemas.notification_schemas import NotificationCreate
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

    # Notify user about org assignment
    try:
        role_text = assign_in.title if getattr(assign_in, 'title', None) else ("Quản lý" if assign_in.is_primary else "Thành viên")
        notification_service.create_notification(
            db=db,
            notification_in=NotificationCreate(
                user_id=assign_in.user_id,
                title="Cập nhật Đơn vị & Chức vụ",
                message=f"Bạn đã được phân bổ vào đơn vị '{org.name}' với vai trò: {role_text}."
            )
        )
    except Exception:
        pass

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
import re
from app.models.settings import SystemSetting

def validate_password_policy(db: Session, password: str):
    if not password:
        return
        
    settings_dict = {}
    db_settings = db.query(SystemSetting).filter(SystemSetting.key.in_([
        "PW_MIN_LENGTH", 
        "PW_REQUIRE_UPPERCASE", 
        "PW_REQUIRE_SYMBOLS"
    ])).all()
    for s in db_settings:
        settings_dict[s.key] = s.value

    min_length = int(settings_dict.get("PW_MIN_LENGTH", "8"))
    require_upper = settings_dict.get("PW_REQUIRE_UPPERCASE", "false") == "true"
    require_symbol = settings_dict.get("PW_REQUIRE_SYMBOLS", "false") == "true"

    if len(password) < min_length:
        raise HTTPException(status_code=400, detail=f"Mật khẩu phải dài ít nhất {min_length} ký tự.")
    if require_upper and not any(char.isupper() for char in password):
        raise HTTPException(status_code=400, detail="Mật khẩu phải chứa ít nhất một chữ viết hoa.")
    if require_symbol and not re.search(r"[\W_]", password):
        raise HTTPException(status_code=400, detail="Mật khẩu phải chứa ít nhất một ký tự đặc biệt.")

def create_user(db: Session, user_in: UserCreate):
    if user_in.password:
        validate_password_policy(db, user_in.password)
        
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
        class_id=user_in.class_id,
        class_name=user_in.class_name,
        academic_year=user_in.academic_year,
        bio=user_in.bio,
        social_links=user_in.social_links,
        password_hash=get_password_hash(user_in.password) if user_in.password else None
    )
    
    db.add(db_user)
    db.flush()

    # Auto-resolve class_name if provided
    if user_in.class_name:
        _resolve_and_assign_class(db, db_user, user_in.class_name)
    elif db_user.class_id and not db_user.class_name:
        # Fallback to sync class_name if class_id is provided but class_name is missing
        org = db.query(Organization).filter(Organization.id == db_user.class_id).first()
        if org:
            db_user.class_name = org.name
    
    if user_in.role_ids:
        roles = db.query(Role).filter(Role.id.in_(user_in.role_ids)).all()
        db_user.roles = roles

    db.commit()
    db.refresh(db_user)
    return db_user

def _resolve_and_assign_class(db: Session, user: User, class_name: str):
    if not class_name:
        return

    org = db.query(Organization).filter(
        Organization.name == class_name,
        Organization.type == OrgType.CLASS
    ).first()

    if not org:
        org = Organization(
            name=class_name,
            type=OrgType.CLASS,
            status=OrgStatus.ACTIVE
        )
        db.add(org)
        db.flush() # Flush to get org.id without committing the entire transaction yet
    
    user.class_id = org.id
    user.class_name = org.name

    # Only assign UserOrganization if user has an id (after flush/commit of user)
    if user.id:
        from app.models.core import UserOrganization
        db_assign = db.query(UserOrganization).filter(
            UserOrganization.user_id == user.id,
            UserOrganization.organization_id == org.id
        ).first()

        if not db_assign:
            # Lấy chức danh mặc định
            from app.models.settings import SystemSetting
            title_setting = db.query(SystemSetting).filter(SystemSetting.key == "DEFAULT_MEMBER_TITLE").first()
            default_title = title_setting.value if title_setting and title_setting.value else "Đoàn viên"

            db_assign = UserOrganization(
                user_id=user.id,
                organization_id=org.id,
                title=default_title,
                is_primary=False,
                joined_date=datetime.now().date()
            )
            db.add(db_assign)

def format_user_dict(db: Session, user: User):
    from app.models.events import EventRegistration
    from app.models.awards import Award, AwardStatus
    
    # Tính toán role_title (ưu tiên vị trí chính)
    role_title = "Thành viên"
    org_data_list = []
    
    for uo in user.organizations:
        org_data_list.append({
            "organization_id": uo.organization_id,
            "organization_name": uo.organization.name if uo.organization else "Đơn vị ẩn",
            "title": uo.title or "Thành viên",
            "is_primary": uo.is_primary,
            "joined_date": uo.joined_date # Phụ thuộc Pydantic serialization
        })
        if uo.is_primary:
            role_title = uo.title
    
    # Nếu chưa có primary role nhưng có đơn vị, lấy role đầu tiên
    if role_title == "Thành viên" and org_data_list:
        role_title = org_data_list[0]["title"] or "Cán bộ"
    
    # Tính toán số lượng hoạt động và khen thưởng thực tế
    try:
        activity_count = db.query(EventRegistration).filter(EventRegistration.user_id == user.id).count()
        award_count = db.query(Award).filter(Award.user_id == user.id, Award.status == AwardStatus.APPROVED).count()
    except Exception:
        activity_count = 0
        award_count = 0

    return {
        "id": user.id,
        "student_id": user.student_id,
        "full_name": user.full_name,
        "email": user.email,
        "phone_number": user.phone_number,
        "status": user.status if user.status else "ACTIVE",
        "avatar_url": user.avatar_url,
        "is_2fa_enabled": user.is_2fa_enabled or False,
        "level": user.level or 1,
        "training_score": user.training_score or 0,
        "class_id": user.class_id,
        "class_name": user.class_name,
        "academic_year": user.academic_year,
        "bio": user.bio,
        "social_links": user.social_links,
        "role_title": role_title or "Thành viên",
        "activity_count": activity_count,
        "award_count": award_count,
        "organizations": org_data_list,
        "roles": [
            {
                "id": r.id,
                "name": r.name,
                "description": r.description,
                "permissions": [] # Fallback cho Schema
            } for r in user.roles
        ],
        "last_login_at": user.last_login_at
    }

def get_users(db: Session, skip: int = 0, limit: int = 100):
    users = db.query(User).offset(skip).limit(limit).all()
    return [format_user_dict(db, u) for u in users]

def update_user(db: Session, user_id: UUID, user_in: UserUpdate, is_admin: bool = False):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Logic: One-time profile update lock
    if db_user.is_profile_updated and not is_admin:
        raise HTTPException(
            status_code=403, 
            detail="Hồ sơ của bạn đã được xác thực và khóa. Vui lòng liên hệ Admin nếu cần thay đổi thông tin."
        )
    
    update_data = user_in.dict(exclude_unset=True)
    
    if "role_ids" in update_data:
        roles = db.query(Role).filter(Role.id.in_(update_data.pop("role_ids"))).all()
        db_user.roles = roles
        
    if "password" in update_data:
        validate_password_policy(db, update_data["password"])
        db_user.password_hash = get_password_hash(update_data.pop("password"))

    # Apply updates
    is_completing = update_data.pop("is_completing", False)
    class_name_updated = "class_name" in update_data
    class_name_val = update_data.get("class_name")

    for key, value in update_data.items():
        if key != "is_profile_updated": # Prevent manual bypass
            setattr(db_user, key, value)
        
    db.flush() # Flush user changes before resolving class so user.id is safe to use

    # Auto-resolve class_name if provided
    if class_name_updated and class_name_val:
        _resolve_and_assign_class(db, db_user, class_name_val)
    elif "class_id" in update_data:
        # Fallback: Sync class_name if class_id changed
        org = db.query(Organization).filter(Organization.id == db_user.class_id).first()
        if org:
            db_user.class_name = org.name
            
    # Automatically lock profile ONLY after a successful self-update with is_completing=True
    if not is_admin and not db_user.is_profile_updated and is_completing:
        db_user.is_profile_updated = True
        
    db.commit()
    db.refresh(db_user)
    
    # Ghi nhật ký: Cập nhật người dùng (bao gồm gán vai trò)
    ai_audit_service.create_system_audit_log(db, AuditLogCreate(
        action="UPDATE_USER",
        entity_type="User",
        entity_id=db_user.id,
        created_at=datetime.now()
    ))
    
    return format_user_dict(db, db_user)

def delete_user(db: Session, user_id: UUID):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}
# ==========================================
# Club Specific Services
# ==========================================
def get_organization_stats(db: Session):
    org_count = db.query(func.count(Organization.id)).scalar() or 0
    leader_count = db.query(func.count(User.id)).join(UserOrganization).filter(
        UserOrganization.is_primary == True
    ).scalar() or 0
    member_count = db.query(func.count(UserOrganization.id)).scalar() or 0
    
    # New stats for Classes
    alert_classes = db.query(func.count(Organization.id)).filter(
        Organization.type == OrgType.CLASS,
        Organization.warning_message != None
    ).scalar() or 0
    
    total_students = db.query(func.count(UserOrganization.id)).join(Organization).filter(
        Organization.type == OrgType.CLASS
    ).scalar() or 0
    
    # Calculate average fee percent
    avg_fee = db.query(func.avg(Organization.fee_percentage)).filter(
        Organization.type == OrgType.CLASS
    ).scalar() or 0
    
    return {
        "totalUnits": org_count,
        "totalLeaders": leader_count,
        "totalMembers": member_count,
        "totalClasses": db.query(func.count(Organization.id)).filter(Organization.type == OrgType.CLASS).scalar() or 0,
        "alertClasses": alert_classes,
        "feePercent": round(float(avg_fee), 1),
        "totalStudents": total_students,
        "subInfo": f"Dữ liệu được cập nhật từ hệ thống"
    }

def get_clubs_detailed_stats(db: Session):
    from app.models.finance import Budget
    total_clubs = db.query(Organization).filter(Organization.type == OrgType.CLUB).count()
    total_members = db.query(UserOrganization).join(Organization).filter(Organization.type == OrgType.CLUB).count()
    total_budget = db.query(func.sum(Budget.total_amount)).join(Organization).filter(Organization.type == OrgType.CLUB).scalar() or 0
    
    return {
        "totalClubs": total_clubs,
        "totalMembers": total_members,
        "totalBudget": float(total_budget)
    }

def get_clubs_list_detailed(db: Session):
    from app.models.finance import Budget
    clubs = db.query(Organization).filter(Organization.type == OrgType.CLUB).all()
    results = []
    for club in clubs:
        leader = db.query(User).join(UserOrganization).filter(
            UserOrganization.organization_id == club.id,
            UserOrganization.is_primary == True
        ).first()
        
        member_count = db.query(UserOrganization).filter(UserOrganization.organization_id == club.id).count()
        budget = db.query(Budget).filter(Budget.organization_id == club.id).order_by(Budget.academic_term_id.desc()).first()
        
        budget_percent = 0
        if budget and budget.total_amount > 0:
            budget_percent = int((budget.used_amount / budget.total_amount) * 100)
            
        results.append({
            "id": str(club.id),
            "name": club.name,
            "leader": leader.full_name if leader else "Chưa có",
            "members": str(member_count),
            "nextEvent": "Cập nhật sau",
            "activity": club.activity_points or 0,
            "budget": budget_percent or int(club.fee_percentage or 0), # Temporary fallback
            "status": club.status.value.lower() if club.status else "active",
            "statusText": club.classification or "Đang hoạt động",
            "statusColor": "emerald" if club.status == OrgStatus.ACTIVE else "rose",
            "borderColor": "blue",
            "icon": club.icon or "groups",
            "warningMsg": club.warning_message,
            "warningDeadline": club.warning_deadline.strftime("%d/%m/%Y") if club.warning_deadline else None
        })
    return results

def get_classes_list_detailed(db: Session):
    classes = db.query(Organization).filter(Organization.type == OrgType.CLASS).all()
    results = []
    for cls in classes:
        leader = db.query(User).join(UserOrganization).filter(
            UserOrganization.organization_id == cls.id,
            UserOrganization.is_primary == True
        ).first()
        
        member_count = db.query(UserOrganization).filter(UserOrganization.organization_id == cls.id).count()
        
        # Check online status based on last_activity_at (e.g., within 15 mins)
        is_online = False
        if cls.last_activity_at:
            is_online = (datetime.now() - cls.last_activity_at).total_seconds() < 900
            
        results.append({
            "id": str(cls.id),
            "name": cls.name,
            "leader": leader.full_name if leader else "Chưa có",
            "total": member_count,
            "fee": float(cls.fee_percentage or 0),
            "activity": cls.activity_points or 0,
            "status": cls.classification or "Khá",
            "online": is_online,
            "lastSeen": cls.last_activity_at.strftime("%H:%M %d/%m") if cls.last_activity_at else "Chưa có",
            "avatar": cls.avatar_url or f"https://ui-avatars.com/api/?name={cls.name}&background=random",
            "alert": cls.warning_message is not None
        })
    return results

def get_organization_members(db: Session, org_id: UUID):
    members = db.query(User).join(UserOrganization).filter(
        UserOrganization.organization_id == org_id
    ).order_by(User.full_name.asc()).all()
    
    results = []
    for u in members:
        # Lấy title trong tổ chức này
        org_rel = next((uo for uo in u.organizations if str(uo.organization_id) == str(org_id)), None)
        if org_rel and org_rel.title:
            title = org_rel.title
        else:
            from app.models.settings import SystemSetting
            title_setting = db.query(SystemSetting).filter(SystemSetting.key == "DEFAULT_MEMBER_TITLE").first()
            title = title_setting.value if title_setting and title_setting.value else "Đoàn viên"
        
        results.append({
            "id": str(u.id),
            "student_id": u.student_id,
            "full_name": u.full_name,
            "email": u.email,
            "phone_number": u.phone_number,
            "status": u.status.value if u.status else "ACTIVE",
            "avatar_url": u.avatar_url,
            "title": title
        })
    return results

def create_club_proposal(db: Session, prop_in: ClubProposalCreate, user_id: UUID):
    db_prop = ClubProposal(**prop_in.dict(), requested_by=user_id)
    db.add(db_prop)
    db.commit()
    db.refresh(db_prop)

    try:
        notification_service.create_notification(
            db=db,
            notification_in=NotificationCreate(
                user_id=user_id,
                title="Đã nhận Đề xuất CLB",
                message=f"Bản nháp đề xuất thành lập '{prop_in.title}' của bạn đã được hệ thống lưu trữ và chờ duyệt."
            )
        )
    except Exception:
        pass

    return db_prop

def get_club_proposals(db: Session):
    props = db.query(ClubProposal).order_by(ClubProposal.created_at.desc()).all()
    results = []
    for p in props:
        results.append({
            "id": str(p.id),
            "title": p.title,
            "user": p.requester.full_name if p.requester else "Ẩn danh",
            "time": p.created_at.strftime("%d/%m/%Y"),
            "icon": p.icon or "help",
            "status": p.status.lower(),
            "amount": float(p.amount) if p.amount else 0,
            "description": p.description
        })
    return results

def approve_club_proposal(db: Session, prop_id: UUID):
    db_prop = db.query(ClubProposal).filter(ClubProposal.id == prop_id).first()
    if not db_prop:
        raise HTTPException(status_code=404, detail="Proposal not found")
    db_prop.status = "APPROVED"
    db.commit()

    if db_prop.requested_by:
        try:
            notification_service.create_notification(
                db=db,
                notification_in=NotificationCreate(
                    user_id=db_prop.requested_by,
                    title="Đề xuất CLB được phê duyệt 🎉",
                    message=f"Chúc mừng! Đề xuất thành lập '{db_prop.title}' của bạn đã được Ban Giám Hiệu phê duyệt."
                )
            )
        except Exception:
            pass

    return db_prop
