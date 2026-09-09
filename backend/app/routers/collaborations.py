import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.core.auth import get_current_user
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

project_collaborations_router = APIRouter(
    prefix="/api/projects",
    tags=["Collaborations"],
)
# ============================================================
# GET ALL COLLABORATIONS
# ============================================================

@router.get(
    "",
    response_model=list[CollaborationResponse]
)
def get_collaborations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    collaborations = db.query(Collaboration).all()
    return collaborations


# ============================================================
# GET SINGLE COLLABORATION
# ============================================================

@router.get(
    "/{collaboration_id}",
    response_model=CollaborationResponse,
)
def get_collaboration(
    collaboration_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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


# ============================================================
# CREATE COLLABORATION
# ============================================================

@router.post(
    "",
    response_model=CollaborationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_collaboration(
    collaboration_data: CollaborationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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

    # Only project owner or ADMIN can create collaborations
    if project.created_by != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this project",
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

# ============================================================
# CREATE COLLABORATION FOR A PROJECT
# POST /api/projects/{project_id}/collaborations
# ============================================================

@project_collaborations_router.post(
    "/{project_id}/collaborations",
    response_model=CollaborationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project_collaboration(
    project_id: uuid.UUID,
    collaboration_data: CollaborationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # --------------------------------------------------------
    # Check project
    # --------------------------------------------------------

    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    # --------------------------------------------------------
    # Make sure request body project_id matches URL project_id
    # --------------------------------------------------------

    if collaboration_data.project_id != project_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project ID in request body does not match URL",
        )

    # --------------------------------------------------------
    # Only project owner or ADMIN can create collaboration
    # --------------------------------------------------------

    if project.created_by != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this project",
        )

    # --------------------------------------------------------
    # Check industry partner
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # Create collaboration
    # --------------------------------------------------------

    collaboration = Collaboration(
        project_id=project_id,
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
# ============================================================
# UPDATE COLLABORATION
# ============================================================

@router.patch(
    "/{collaboration_id}",
    response_model=CollaborationResponse,
)
def update_collaboration(
    collaboration_id: uuid.UUID,
    collaboration_data: CollaborationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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

    project = (
        db.query(Project)
        .filter(Project.id == collaboration.project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    # Only project owner or ADMIN can update collaborations
    if project.created_by != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this project",
        )

    update_data = collaboration_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(collaboration, field, value)

    db.commit()
    db.refresh(collaboration)

    return collaboration


# ============================================================
# DELETE COLLABORATION
# ============================================================

@router.delete(
    "/{collaboration_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_collaboration(
    collaboration_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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

    project = (
        db.query(Project)
        .filter(Project.id == collaboration.project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    # Only project owner or ADMIN can delete collaborations
    if project.created_by != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this project",
        )

    db.delete(collaboration)
    db.commit()

    return None