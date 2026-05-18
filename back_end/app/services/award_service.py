import json
from datetime import date, datetime, timezone
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc
from typing import Optional
from uuid import UUID

from app.models.awards import Award, AwardStatus, AwardCriteria, CriteriaType
from app.models.core import Organization, OrgType, AcademicTerm, User, UserOrganization
from app.models.events import EventRegistration, EventRegistrationStatus
from app.models.settings import SystemSetting
from app.schemas.award_schemas import AwardCreate, AwardUpdate
from app.services.notification_service import create_notification
from app.schemas.notification_schemas import NotificationCreate

AWARD_CAMPAIGN_SETTING_KEY = "AWARD_ACTIVE_CAMPAIGN"
AWARD_CAMPAIGN_HISTORY_SETTING_KEY = "AWARD_CAMPAIGN_HISTORY"

DEFAULT_AWARD_CAMPAIGN = {
    "award_name": "Sinh vien 5 tot cap Truong",
    "title": "Xet duyet Sinh vien 5 Tot cap Truong",
    "academic_year": "2025-2026",
    "short_label": "Dot xet duyet hien hanh",
    "description": "He thong dang mo cong nhan ho so minh chung truc tuyen.",
    "deadline": None,
    "status_tag": "Dang dien ra",
    "submission_open": True,
    "button_label": "Nop ho so minh chung ngay",
}


def _normalize_award_campaign_config(config: Optional[dict] = None):
    merged = {**DEFAULT_AWARD_CAMPAIGN, **(config or {})}
    deadline = merged.get("deadline")
    remaining_days = None

    if isinstance(deadline, date):
        deadline_date = deadline
    elif isinstance(deadline, str) and deadline:
        try:
            deadline_date = date.fromisoformat(deadline)
        except ValueError:
            deadline_date = None
    else:
        deadline_date = None

    if deadline_date:
        remaining_days = max(0, (deadline_date - date.today()).days)
        merged["deadline"] = deadline_date.isoformat()
    else:
        merged["deadline"] = None

    merged["remaining_days"] = remaining_days
    return merged


def get_award_campaign_config(db: Session):
    db_setting = db.query(SystemSetting).filter(SystemSetting.key == AWARD_CAMPAIGN_SETTING_KEY).first()
    if not db_setting or not db_setting.value:
        return _normalize_award_campaign_config()

    try:
        parsed = json.loads(db_setting.value)
    except json.JSONDecodeError:
        parsed = {}

    return _normalize_award_campaign_config(parsed)


def get_award_campaign_history(db: Session, limit: int = 20):
    db_setting = db.query(SystemSetting).filter(SystemSetting.key == AWARD_CAMPAIGN_HISTORY_SETTING_KEY).first()
    if not db_setting or not db_setting.value:
        return []

    try:
        parsed = json.loads(db_setting.value)
    except json.JSONDecodeError:
        parsed = []

    history = []
    for item in parsed[:limit]:
        normalized = _normalize_award_campaign_config(item)
        normalized["changed_at"] = item.get("changed_at")
        normalized["changed_by_user_id"] = item.get("changed_by_user_id")
        normalized["changed_by_name"] = item.get("changed_by_name")
        history.append(normalized)
    return history


def update_award_campaign_config(db: Session, config_data: dict, actor: Optional[User] = None):
    current_config = get_award_campaign_config(db)
    merged_config = {**current_config, **config_data}
    normalized_config = _normalize_award_campaign_config(merged_config)
    value_to_store = {k: v for k, v in normalized_config.items() if k != "remaining_days"}

    db_setting = db.query(SystemSetting).filter(SystemSetting.key == AWARD_CAMPAIGN_SETTING_KEY).first()
    if db_setting:
        db_setting.value = json.dumps(value_to_store)
    else:
        db_setting = SystemSetting(
            key=AWARD_CAMPAIGN_SETTING_KEY,
            value=json.dumps(value_to_store),
            description="Active award campaign configuration",
        )
        db.add(db_setting)

    history_setting = db.query(SystemSetting).filter(SystemSetting.key == AWARD_CAMPAIGN_HISTORY_SETTING_KEY).first()
    if history_setting and history_setting.value:
        try:
            history_items = json.loads(history_setting.value)
        except json.JSONDecodeError:
            history_items = []
    else:
        history_items = []

    history_entry = {
        **value_to_store,
        "changed_at": datetime.now(timezone.utc).isoformat(),
        "changed_by_user_id": str(actor.id) if actor else None,
        "changed_by_name": actor.full_name if actor else None,
    }
    history_items.insert(0, history_entry)
    history_items = history_items[:50]

    if history_setting:
        history_setting.value = json.dumps(history_items)
    else:
        history_setting = SystemSetting(
            key=AWARD_CAMPAIGN_HISTORY_SETTING_KEY,
            value=json.dumps(history_items),
            description="Award campaign history snapshots",
        )
        db.add(history_setting)

    db.commit()
    return normalized_config


def check_award_eligibility(db: Session, user_id: UUID):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"passed": False, "error": "User not found"}

    criteria_list = db.query(AwardCriteria).all()
    results = []
    overall_passed = True

    for criteria in criteria_list:
        passed = False
        actual_val = "N/A"

        if criteria.type == CriteriaType.MIN_TRAINING_SCORE:
            actual_val = user.training_score or 0
            passed = float(actual_val) >= float(criteria.value)
        elif criteria.type == CriteriaType.MIN_GPA:
            actual_val = 3.5
            passed = float(actual_val) >= float(criteria.value)
        elif criteria.type == CriteriaType.MIN_EVENTS_ATTENDED:
            actual_val = (
                db.query(EventRegistration)
                .filter(
                    EventRegistration.user_id == user_id,
                    EventRegistration.status == EventRegistrationStatus.ATTENDED,
                )
                .count()
            )
            passed = int(actual_val) >= int(criteria.value)

        results.append(
            {
                "criteria_name": criteria.name,
                "required": criteria.value,
                "actual": str(actual_val),
                "passed": passed,
                "is_required": criteria.is_required,
            }
        )

        if criteria.is_required and not passed:
            overall_passed = False

    return {
        "overall_passed": overall_passed,
        "details": results,
    }


def create_award_application(db: Session, award_in: AwardCreate):
    active_campaign = get_award_campaign_config(db)
    if not active_campaign.get("submission_open", True):
        raise ValueError("Award submission is currently closed")
    screening = check_award_eligibility(db, award_in.user_id)

    obj_data = award_in.model_dump(exclude={"screening_results"})
    if not obj_data.get("award_name"):
        obj_data["award_name"] = active_campaign["award_name"]
    db_obj = Award(**obj_data, screening_results=screening)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)

    try:
        notif_in = NotificationCreate(
            user_id=db_obj.user_id,
            title="Da luu ho so xet duyet",
            message=f"Ho so '{db_obj.award_name}' cua ban da duoc ghi nhan va dang cho Admin xet duyet.",
        )
        create_notification(db, notif_in)
    except Exception as e:
        print(f"Loi khi gui thong bao nop ho so: {e}")

    return db_obj


def get_awards_list(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[UUID] = None,
    award_name: Optional[str] = None,
):
    query = db.query(Award).options(
        joinedload(Award.user).joinedload(User.organizations).joinedload(UserOrganization.organization)
    )
    if user_id:
        query = query.filter(Award.user_id == user_id)
    if award_name:
        query = query.filter(Award.award_name == award_name)

    awards = query.offset(skip).limit(limit).all()

    for award in awards:
        if award.user:
            award.full_name = award.user.full_name
            award.student_id = award.user.student_id

            primary_org = next((uo.organization for uo in award.user.organizations if uo.is_primary), None)
            if not primary_org and award.user.organizations:
                primary_org = award.user.organizations[0].organization

            if primary_org:
                award.university = primary_org.name

    return awards


def update_award_assessment(db: Session, award_id: UUID, award_in: AwardUpdate):
    db_obj = db.query(Award).filter(Award.id == award_id).first()
    if not db_obj:
        return None

    update_data = award_in.model_dump(exclude_unset=True)
    comments = update_data.pop("comments", None)

    for field, value in update_data.items():
        setattr(db_obj, field, value)

    if comments:
        assessment = db_obj.assessment or {}
        assessment["comments"] = comments
        db_obj.assessment = assessment

    if not db_obj.status or db_obj.status == AwardStatus.PENDING:
        db_obj.status = AwardStatus.APPROVED

    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)

    try:
        status_str = "DUOC DUYET" if db_obj.status == AwardStatus.APPROVED else "BI TU CHOI"
        notif_msg = f"Ho so '{db_obj.award_name}' cua ban da {status_str}."
        if comments:
            notif_msg += f" Kem loi nhan: {comments}"

        notif_in = NotificationCreate(
            user_id=db_obj.user_id,
            title=f"Ket qua khao thi: {status_str}",
            message=notif_msg,
        )
        create_notification(db, notif_in)
    except Exception as e:
        print(f"Loi khi gui thong bao ket qua xet duyet: {e}")

    return db_obj


def get_award_stats(db: Session, timescale: str = "Thang nay", award_name: Optional[str] = None):
    active_campaign = get_award_campaign_config(db)
    remaining_days = active_campaign.get("remaining_days")
    if remaining_days is None:
        current_term = db.query(AcademicTerm).filter(AcademicTerm.is_current == True).first()
        if current_term and current_term.end_date:
            delta = current_term.end_date - date.today()
            remaining_days = max(0, delta.days)

    awards_query = db.query(Award)
    if award_name:
        awards_query = awards_query.filter(Award.award_name == award_name)

    total_submitted = awards_query.count()
    total_approved = awards_query.filter(Award.status == AwardStatus.APPROVED).count()
    pass_rate = "0%"
    if total_submitted > 0:
        pass_rate = f"{int((total_approved / total_submitted) * 100)}%"

    rankings_query = (
        db.query(Organization)
        .filter(Organization.type == OrgType.CLASS)
        .order_by(desc(Organization.activity_points))
        .limit(10)
        .all()
    )

    rankings = []
    for i, org in enumerate(rankings_query):
        rankings.append(
            {
                "rank": i + 1,
                "icon": "top",
                "class": org.name,
                "university": org.name,
                "dept": "Khoa CNTT",
                "score": org.activity_points,
                "trend": "On dinh",
                "trendColor": "slate",
                "tags": [f"Doan phi {int(org.fee_percentage)}%"] if org.fee_percentage > 0 else [],
            }
        )

    warning_org = (
        db.query(Organization)
        .filter(Organization.type == OrgType.CLASS)
        .order_by(Organization.activity_points.asc())
        .first()
    )

    warning_class = None
    if warning_org:
        warning_class = {
            "rank": db.query(Organization)
            .filter(
                Organization.type == OrgType.CLASS,
                Organization.activity_points > warning_org.activity_points,
            )
            .count()
            + 1,
            "class": warning_org.name,
            "university": warning_org.name,
            "dept": "Khoa CNTT",
            "score": warning_org.activity_points,
            "trend": "Can luu y",
            "note": warning_org.warning_message or "Diem hoat dong thap",
        }

    return {
        "summary": {
            "remainingDays": str(remaining_days) if remaining_days is not None else "N/A",
            "submitted": str(total_submitted),
            "approved": str(total_approved),
            "passRate": pass_rate,
        },
        "stats": [
            {
                "label": "TONG HO SO",
                "title": "Khen thuong",
                "val": f"{total_submitted} ho so",
                "icon": "folder_shared",
                "color": "blue",
                "progress": int((total_approved / total_submitted * 100)) if total_submitted > 0 else 0,
                "action": "Dang xu ly",
            },
            {
                "label": "HOAN THANH",
                "title": "Da xet duyet",
                "val": f"{total_approved} ho so",
                "icon": "verified",
                "color": "orange",
                "trend": f"Ti le duyet {pass_rate}",
            },
            {
                "label": "CANH BAO",
                "title": "Cham tien do",
                "val": f"{db.query(Organization).filter(Organization.warning_message != None).count()} chi doan",
                "icon": "warning",
                "color": "rose",
                "alert": "Can nhac nho ngay",
            },
        ],
        "rankings": rankings,
        "warningClass": warning_class,
    }
