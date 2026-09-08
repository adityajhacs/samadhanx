import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.collaboration import Collaboration
from app.models.project import Project
from app.models.industry_partner import IndustryPartner
from app.schemas.collaboration import (
    CollaborationCreate,
    CollaborationUpdate,
    CollaborationResponse,
)


router = APIRouter(
    prefix="/api/collaborations",
    tags=["Collaborations"],
)


@router.get(
    "",
    response_model=list[CollaborationResponse]
)
def get_collaborations(
    db: Session = Depends(get_db),
):
    collaborations = db.query(Collaboration).all()
    return collaborations


@router.get(
    "/{collaboration_id}",
    response_model=CollaborationResponse,
)
def get_collaboration(
    collaboration_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    collaboration = (
        db.query(Collaboration)
        .filter(Collaboration.id == collaboration_id)
        .first()
    )

    if not collaboration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found",
        )

    return collaboration


@router.post(
    "",
    response_model=CollaborationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_collaboration(
    collaboration_data: CollaborationCreate,
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .filter(Project.id == collaboration_data.project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    partner = (
        db.query(IndustryPartner)
        .filter(
            IndustryPartner.id
            == collaboration_data.industry_partner_id
        )
        .first()
    )

    if not partner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Industry partner not found",
        )

    collaboration = Collaboration(
        project_id=collaboration_data.project_id,
        industry_partner_id=collaboration_data.industry_partner_id,
        collaboration_type=collaboration_data.collaboration_type,
        amount=collaboration_data.amount,
        status=collaboration_data.status,
        description=collaboration_data.description,
    )

    db.add(collaboration)
    db.commit()
    db.refresh(collaboration)

    return collaboration


@router.patch(
    "/{collaboration_id}",
    response_model=CollaborationResponse,
)
def update_collaboration(
    collaboration_id: uuid.UUID,
    collaboration_data: CollaborationUpdate,
    db: Session = Depends(get_db),
):
    collaboration = (
        db.query(Collaboration)
        .filter(Collaboration.id == collaboration_id)
        .first()
    )

    if not collaboration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found",
        )

    update_data = collaboration_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(collaboration, field, value)

    db.commit()
    db.refresh(collaboration)

    return collaboration


@router.delete(
    "/{collaboration_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_collaboration(
    collaboration_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    collaboration = (
        db.query(Collaboration)
        .filter(Collaboration.id == collaboration_id)
        .first()
    )

    if not collaboration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found",
        )

    db.delete(collaboration)
    db.commit()

    return None