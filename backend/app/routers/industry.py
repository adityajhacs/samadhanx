
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.auth import get_current_user

from app.models.industry_partner import IndustryPartner
from app.models.user import User

from app.schemas.industry_partner import (
    IndustryPartnerCreate,
    IndustryPartnerUpdate,
    IndustryPartnerResponse,
)


# ============================================================
# Industry Router
# ============================================================

router = APIRouter(
    prefix="/api/industry",
    tags=["Industry"],
)


# ============================================================
# ROLE HELPER
# ============================================================

def get_role(current_user: User) -> str:
    return (current_user.role or "").strip().lower()


# ============================================================
# INDUSTRY / ADMIN ACCESS
# ============================================================

def require_industry_or_admin(
    current_user: User,
):
    role = get_role(current_user)

    if role not in {"industry", "admin"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only industry and admin users can "
                "manage industry partners"
            ),
        )


# ============================================================
# OWNERSHIP CHECK
# ============================================================

def check_industry_ownership(
    industry_id: uuid.UUID,
    current_user: User,
):
    role = get_role(current_user)

    # Admin can manage any industry profile
    if role == "admin":
        return

    # Industry user can manage only the profile
    # linked to their own account.
    if role == "industry":
        if current_user.industry_id != industry_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "You can only manage your own "
                    "industry profile"
                ),
            )
        return

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=(
            "You are not authorized to manage "
            "this industry profile"
        ),
    )


# ============================================================
# GET /api/industry
# Get all industry partners
# ============================================================

@router.get(
    "",
    response_model=list[IndustryPartnerResponse],
)
def get_industry_partners(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    partners = (
        db.query(IndustryPartner)
        .order_by(IndustryPartner.name.asc())
        .all()
    )

    return partners


# ============================================================
# GET /api/industry/{industry_id}
# Get one industry partner
# ============================================================

@router.get(
    "/{industry_id}",
    response_model=IndustryPartnerResponse,
)
def get_industry_partner(
    industry_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    partner = (
        db.query(IndustryPartner)
        .filter(
            IndustryPartner.id == industry_id
        )
        .first()
    )

    if not partner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Industry partner not found",
        )

    return partner


# ============================================================
# POST /api/industry
# Create industry partner
# ============================================================

@router.post(
    "",
    response_model=IndustryPartnerResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_industry_partner(
    partner_data: IndustryPartnerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    role = get_role(current_user)

    # Only Industry and Admin can create
    require_industry_or_admin(current_user)

    # One Industry account -> one Industry profile
    if role == "industry" and current_user.industry_id is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "Your account is already linked "
                "to an industry profile"
            ),
        )

    partner = IndustryPartner(
        name=partner_data.name,
        industry_type=partner_data.industry_type,
        description=partner_data.description,
        location=partner_data.location,
        contact_email=partner_data.contact_email,
    )

    db.add(partner)
    db.flush()

    # Automatically link the Industry user
    # to the newly created IndustryPartner.
    if role == "industry":
        current_user.industry_id = partner.id

    db.commit()
    db.refresh(partner)

    return partner


# ============================================================
# PATCH /api/industry/{industry_id}
# Update industry partner
# ============================================================

@router.patch(
    "/{industry_id}",
    response_model=IndustryPartnerResponse,
)
def update_industry_partner(
    industry_id: uuid.UUID,
    partner_data: IndustryPartnerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Only Industry/Admin
    require_industry_or_admin(current_user)

    # Industry -> own profile only
    # Admin    -> any profile
    check_industry_ownership(
        industry_id,
        current_user,
    )

    partner = (
        db.query(IndustryPartner)
        .filter(
            IndustryPartner.id == industry_id
        )
        .first()
    )

    if not partner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Industry partner not found",
        )

    update_data = partner_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            partner,
            field,
            value,
        )

    db.commit()
    db.refresh(partner)

    return partner


# ============================================================
# DELETE /api/industry/{industry_id}
# Delete industry partner
# ============================================================

@router.delete(
    "/{industry_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_industry_partner(
    industry_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Only Industry/Admin
    require_industry_or_admin(current_user)

    # Industry -> own profile only
    # Admin    -> any profile
    check_industry_ownership(
        industry_id,
        current_user,
    )

    partner = (
        db.query(IndustryPartner)
        .filter(
            IndustryPartner.id == industry_id
        )
        .first()
    )

    if not partner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Industry partner not found",
        )

    # If the logged-in Industry user is deleting
    # their own profile, remove the link first.
    if get_role(current_user) == "industry":
        current_user.industry_id = None

    db.delete(partner)
    db.commit()

    return None

