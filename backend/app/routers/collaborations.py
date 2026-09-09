import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.collaboration import Collaboration
from app.models.industry_partner import IndustryPartner
from app.models.project import Project
from app.models.user import User
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
# HELPER — GET PROJECT
# ============================================================

def get_project_or_404(
    project_id: uuid.UUID,
    db: Session,
):
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

    return project


# ============================================================
# GET ALL COLLABORATIONS
# GET /api/collaborations
# ============================================================

@router.get(
    "",
    response_model=list[CollaborationResponse],
)
def get_collaborations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Collaboration).all()


# ============================================================
# GET SINGLE COLLABORATION
# GET /api/collaborations/{collaboration_id}
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
# POST /api/collaborations
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
    project = get_project_or_404(
        collaboration_data.project_id,
        db,
    )

    # University / project owner / admin can request
    allowed_roles = ["UNIVERSITY", "FACULTY", "STUDENT", "ADMIN"]

    if (
        current_user.role not in allowed_roles
        and project.created_by != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to request collaboration",
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
        status="REQUESTED",
        description=collaboration_data.description,
    )

    db.add(collaboration)
    db.commit()
    db.refresh(collaboration)

    return collaboration


# ============================================================
# CREATE COLLABORATION FOR PROJECT
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
    project = get_project_or_404(
        project_id,
        db,
    )

    # URL project_id and body project_id must match
    if collaboration_data.project_id != project_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project ID in request body does not match URL",
        )

    allowed_roles = ["UNIVERSITY", "FACULTY", "STUDENT", "ADMIN"]

    if (
        current_user.role not in allowed_roles
        and project.created_by != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to request collaboration",
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
        project_id=project_id,
        industry_partner_id=collaboration_data.industry_partner_id,
        collaboration_type=collaboration_data.collaboration_type,
        amount=collaboration_data.amount,
        status="REQUESTED",
        description=collaboration_data.description,
    )

    db.add(collaboration)
    db.commit()
    db.refresh(collaboration)

    return collaboration


# ============================================================
# GET PROJECT COLLABORATIONS
# GET /api/projects/{project_id}/collaborations
# ============================================================

@project_collaborations_router.get(
    "/{project_id}/collaborations",
    response_model=list[CollaborationResponse],
)
def get_project_collaborations(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    get_project_or_404(
        project_id,
        db,
    )

    collaborations = (
        db.query(Collaboration)
        .filter(
            Collaboration.project_id == project_id
        )
        .all()
    )

    return collaborations


# ============================================================
# UPDATE COLLABORATION
# PATCH /api/collaborations/{collaboration_id}
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

    project = get_project_or_404(
        collaboration.project_id,
        db,
    )

    update_data = collaboration_data.model_dump(
        exclude_unset=True
    )

    # --------------------------------------------------------
    # STATUS UPDATE
    # --------------------------------------------------------

    if "status" in update_data:

        new_status = update_data["status"]

        # Industry / Admin can change collaboration status
        if current_user.role not in ["INDUSTRY", "ADMIN"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only industry partner or admin can update collaboration status",
            )

        # MVP status flow
        allowed_statuses = {
            "REQUESTED",
            "UNDER_REVIEW",
            "ACCEPTED",
            "REJECTED",
            "COMPLETED",
        }

        if new_status not in allowed_statuses:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid collaboration status",
            )

    # --------------------------------------------------------
    # OTHER FIELD UPDATES
    # --------------------------------------------------------

    non_status_update = any(
        field != "status"
        for field in update_data
    )

    if non_status_update:
        if (
            project.created_by != current_user.id
            and current_user.role != "ADMIN"
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to modify this collaboration",
            )

    # --------------------------------------------------------
    # APPLY UPDATE
    # --------------------------------------------------------

    for field, value in update_data.items():
        setattr(
            collaboration,
            field,
            value,
        )

    db.commit()
    db.refresh(collaboration)

    return collaboration


# ============================================================
# DELETE COLLABORATION
# DELETE /api/collaborations/{collaboration_id}
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

    project = get_project_or_404(
        collaboration.project_id,
        db,
    )

    if (
        project.created_by != current_user.id
        and current_user.role != "ADMIN"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this collaboration",
        )

    db.delete(collaboration)
    db.commit()

    return None