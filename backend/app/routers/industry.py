import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.industry_partner import IndustryPartner
from app.schemas.industry_partner import (
    IndustryPartnerCreate,
    IndustryPartnerUpdate,
    IndustryPartnerResponse,
)


router = APIRouter(
    prefix="/api/industry-partners",
    tags=["Industry Partners"],
)


@router.get(
    "",
    response_model=list[IndustryPartnerResponse]
)
def get_industry_partners(
    db: Session = Depends(get_db),
):
    partners = db.query(IndustryPartner).all()
    return partners


@router.get(
    "/{partner_id}",
    response_model=IndustryPartnerResponse,
)
def get_industry_partner(
    partner_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    partner = (
        db.query(IndustryPartner)
        .filter(IndustryPartner.id == partner_id)
        .first()
    )

    if not partner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Industry partner not found",
        )

    return partner


@router.post(
    "",
    response_model=IndustryPartnerResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_industry_partner(
    partner_data: IndustryPartnerCreate,
    db: Session = Depends(get_db),
):
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


@router.patch(
    "/{partner_id}",
    response_model=IndustryPartnerResponse,
)
def update_industry_partner(
    partner_id: uuid.UUID,
    partner_data: IndustryPartnerUpdate,
    db: Session = Depends(get_db),
):
    partner = (
        db.query(IndustryPartner)
        .filter(IndustryPartner.id == partner_id)
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


@router.delete(
    "/{partner_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_industry_partner(
    partner_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    partner = (
        db.query(IndustryPartner)
        .filter(IndustryPartner.id == partner_id)
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