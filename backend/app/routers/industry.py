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
# Allowed roles for Industry write operations
# ============================================================

ALLOWED_INDUSTRY_WRITE_ROLES = {
    "CITIZEN",
    "UNIVERSITY",
    "STUDENT",
    "FACULTY",
    "INDUSTRY",
    "GOVERNMENT",
    "ADMIN",
}


# ============================================================
# Industry Router
# ============================================================

router = APIRouter(
    prefix="/api/industry",
    tags=["Industry"],
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
):
    partners = db.query(IndustryPartner).all()

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
):
    partner = (
        db.query(IndustryPartner)
        .filter(IndustryPartner.id == industry_id)
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
    if current_user.role not in ALLOWED_INDUSTRY_WRITE_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to create an industry partner",
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
    if current_user.role not in ALLOWED_INDUSTRY_WRITE_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update an industry partner",
        )

    partner = (
        db.query(IndustryPartner)
        .filter(IndustryPartner.id == industry_id)
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
        setattr(partner, field, value)

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
    if current_user.role not in ALLOWED_INDUSTRY_WRITE_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete an industry partner",
        )

    partner = (
        db.query(IndustryPartner)
        .filter(IndustryPartner.id == industry_id)
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