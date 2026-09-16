
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
    """
    Normalize the current user's role.

    This keeps role checks consistent across the backend,
    regardless of whether the database contains:
        industry
        INDUSTRY
        Industry
    """

    return (current_user.role or "").strip().lower()


# ============================================================
# INDUSTRY ACCESS
# ============================================================

def require_industry_write_access(
    current_user: User,
):
    """
    Only Industry and Admin users can create, update,
    or delete industry partner records.

    Other portal roles are read-only.
    """

    role = get_role(current_user)

    if role not in {
        "industry",
        "admin",
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only industry and admin users can "
                "manage industry partners"
            ),
        )


def require_industry_or_admin(
    current_user: User,
):
    """
    Explicit helper for operations that require
    Industry or Admin access.
    """

    role = get_role(current_user)

    if role not in {
        "industry",
        "admin",
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only industry and admin users have "
                "access to this operation"
            ),
        )


# ============================================================
# GET /api/industry
#
# Get all industry partners.
#
# Authenticated users can view industry partners.
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
#
# Get one industry partner.
#
# Authenticated users can view an industry partner.
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
#
# Create industry partner.
#
# Industry + Admin -> allowed
# Others            -> forbidden
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
    require_industry_write_access(
        current_user
    )

    partner = IndustryPartner(
        name=partner_data.name,
        industry_type=partner_data.industry_type,
        description=partner_data.description,
        location=partner_data.location,
        contact_email=partner_data.contact_email,
    )

    db.add(partner)
    db.commit()
    db.refresh(partner)

    return partner


# ============================================================
# PATCH /api/industry/{industry_id}
#
# Update industry partner.
#
# Industry + Admin -> allowed
# Others            -> forbidden
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
    require_industry_write_access(
        current_user
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
#
# Delete industry partner.
#
# Industry + Admin -> allowed
# Others            -> forbidden
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
    require_industry_write_access(
        current_user
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

    db.delete(partner)
    db.commit()

    return None

