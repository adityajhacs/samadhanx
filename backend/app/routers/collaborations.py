
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db

from app.models.collaboration import Collaboration
from app.models.industry_partner import IndustryPartner
from app.models.project import Project
from app.models.solution import Solution
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
# ROLE HELPERS
# ============================================================

def normalize_role(role: str | None) -> str:
    return (role or "").strip().lower()


def is_admin(user: User) -> bool:
    return normalize_role(user.role) == "admin"


def get_project_university_id(
    project: Project,
    db: Session,
):
    """
    Project university is currently inferred through:

    Project -> Solution -> University
    """

    if not project.solution_id:
        return None

    solution = (
        db.query(Solution)
        .filter(Solution.id == project.solution_id)
        .first()
    )

    if not solution:
        return None

    return solution.university_id


def belongs_to_same_university(
    user: User,
    project: Project,
    db: Session,
) -> bool:
    """
    Checks whether the current user belongs to the
    university owning the project.
    """

    if not user.university_id:
        return False

    project_university_id = get_project_university_id(
        project,
        db,
    )

    if not project_university_id:
        return False

    return user.university_id == project_university_id


def is_project_creator(
    user: User,
    project: Project,
) -> bool:
    """
    Only the Faculty who created the project is
    considered the project owner/manager.
    """

    return project.created_by == user.id


def can_request_collaboration(
    user: User,
    project: Project,
    db: Session,
) -> bool:
    """
    Collaboration request permissions:

    Admin:
        Any project.

    University:
        Own university's project.

    Faculty:
        Only projects created by that Faculty.

    Industry:
        Can request collaboration for any project.

    Student:
        Cannot request collaboration.
    """

    role = normalize_role(user.role)

    if role == "admin":
        return True

    if role == "university":
        return belongs_to_same_university(
            user,
            project,
            db,
        )

    if role == "faculty":
        return is_project_creator(
            user,
            project,
        )

    if role == "industry":
        return user.industry_id is not None

    return False


def can_manage_project_collaboration(
    user: User,
    project: Project,
    db: Session,
) -> bool:
    """
    Permissions for modifying/deleting collaboration
    fields other than status.

    Admin:
        Any project.

    University:
        Own university's project.

    Faculty:
        Only project creator/owner.

    Industry:
        Cannot modify/delete collaboration fields.

    Student:
        Cannot manage collaboration.
    """

    role = normalize_role(user.role)

    if role == "admin":
        return True

    if role == "university":
        return belongs_to_same_university(
            user,
            project,
            db,
        )

    if role == "faculty":
        return is_project_creator(
            user,
            project,
        )

    return False


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
# GET COLLABORATIONS
# GET /api/collaborations
#
# Admin:
#     Can view all collaborations.
#
# Industry:
#     Can view only collaborations belonging to
#     their own industry partner.
#
# University / Faculty / Student:
#     Can view collaboration information.
#
# Read-only.
# ============================================================

@router.get(
    "",
    response_model=list[CollaborationResponse],
)
def get_collaborations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    role = normalize_role(current_user.role)

    # Admin can view everything.
    if role == "admin":
        return (
            db.query(Collaboration)
            .order_by(Collaboration.created_at.desc())
            .all()
        )

    # Industry can only see collaborations
    # connected to its own industry profile.
    if role == "industry":
        if not current_user.industry_id:
            return []

        return (
            db.query(Collaboration)
            .filter(
                Collaboration.industry_partner_id
                == current_user.industry_id
            )
            .order_by(Collaboration.created_at.desc())
            .all()
        )

    # Existing behavior for other roles.
    return (
        db.query(Collaboration)
        .order_by(Collaboration.created_at.desc())
        .all()
    )


# ============================================================
# GET SINGLE COLLABORATION
# GET /api/collaborations/{collaboration_id}
#
# Industry:
#     Can view only its own collaboration.
#
# Admin:
#     Can view any collaboration.
#
# Other authenticated users:
#     Existing read behavior remains.
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
        .filter(
            Collaboration.id == collaboration_id
        )
        .first()
    )

    if not collaboration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collaboration not found",
        )

    role = normalize_role(current_user.role)

    if role == "industry":
        if (
            not current_user.industry_id
            or collaboration.industry_partner_id
            != current_user.industry_id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "You are not authorized to view "
                    "this collaboration"
                ),
            )

    return collaboration


# ============================================================
# CREATE COLLABORATION
# POST /api/collaborations
#
# Allowed:
#   Admin
#   University -> own university project
#   Faculty -> project created by that Faculty
#   Industry -> any project
#
# Student -> FORBIDDEN
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

    if not can_request_collaboration(
        current_user,
        project,
        db,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized to request "
                "collaboration for this project"
            ),
        )

    role = normalize_role(current_user.role)

    # --------------------------------------------------------
    # INDUSTRY OWNERSHIP
    #
    # Industry users cannot create a collaboration
    # on behalf of another industry.
    # --------------------------------------------------------

    industry_partner_id = (
        collaboration_data.industry_partner_id
    )

    if role == "industry":
        if not current_user.industry_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Your industry account is not linked "
                    "to an industry profile"
                ),
            )

        if (
            industry_partner_id
            != current_user.industry_id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "You can only create collaborations "
                    "for your own industry profile"
                ),
            )

    partner = (
        db.query(IndustryPartner)
        .filter(
            IndustryPartner.id
            == industry_partner_id
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
        industry_partner_id=industry_partner_id,
        collaboration_type=(
            collaboration_data.collaboration_type
        ),
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
#
# Allowed:
#   Admin
#   University -> own university project
#   Faculty -> project creator only
#   Industry -> any project
#
# Student -> FORBIDDEN
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

    # --------------------------------------------------------
    # URL project_id and body project_id must match
    # --------------------------------------------------------

    if collaboration_data.project_id != project_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Project ID in request body does not "
                "match URL"
            ),
        )

    # --------------------------------------------------------
    # Check collaboration request permission
    # --------------------------------------------------------

    if not can_request_collaboration(
        current_user,
        project,
        db,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized to request "
                "collaboration for this project"
            ),
        )

    role = normalize_role(current_user.role)

    # --------------------------------------------------------
    # Industry can only send request using its own
    # industry profile.
    # --------------------------------------------------------

    industry_partner_id = (
        collaboration_data.industry_partner_id
    )

    if role == "industry":
        if not current_user.industry_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Your industry account is not linked "
                    "to an industry profile"
                ),
            )

        if (
            industry_partner_id
            != current_user.industry_id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "You can only create collaborations "
                    "for your own industry profile"
                ),
            )

    partner = (
        db.query(IndustryPartner)
        .filter(
            IndustryPartner.id
            == industry_partner_id
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
        industry_partner_id=industry_partner_id,
        collaboration_type=(
            collaboration_data.collaboration_type
        ),
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
#
# Read-only.
#
# Existing behavior preserved:
# All authenticated users can view collaborations
# for a project.
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
#
# STATUS:
#   Industry / Admin
#
# OTHER FIELDS:
#   University -> own university project
#   Faculty -> own project only
#   Admin
#
# Industry:
#   Cannot modify non-status fields.
#
# Student:
#   Cannot update.
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
        .filter(
            Collaboration.id == collaboration_id
        )
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

    role = normalize_role(current_user.role)

    # --------------------------------------------------------
    # Industry can only update the status of its own
    # collaboration.
    # --------------------------------------------------------

    if role == "industry":
        if (
            not current_user.industry_id
            or collaboration.industry_partner_id
            != current_user.industry_id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "You are not authorized to update "
                    "this collaboration"
                ),
            )

    update_data = collaboration_data.model_dump(
        exclude_unset=True
    )

    # --------------------------------------------------------
    # STATUS UPDATE
    # --------------------------------------------------------

    if "status" in update_data:

        new_status = update_data["status"]

        # Only Industry / Admin can update status.
        if role not in {"industry", "admin"}:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Only industry partners or admin "
                    "can update collaboration status"
                ),
            )

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

        if not can_manage_project_collaboration(
            current_user,
            project,
            db,
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "You are not authorized to modify "
                    "this collaboration"
                ),
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
#
# Admin:
#   Allowed
#
# University:
#   Own university project only
#
# Faculty:
#   Project creator only
#
# Industry:
#   Cannot delete
#
# Student:
#   FORBIDDEN
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
        .filter(
            Collaboration.id == collaboration_id
        )
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

    if not can_manage_project_collaboration(
        current_user,
        project,
        db,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized to delete "
                "this collaboration"
            ),
        )

    db.delete(collaboration)
    db.commit()

    return None

