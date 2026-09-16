from pathlib import Path
import uuid

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db

from app.models.project import Project
from app.models.project_member import ProjectMember
from app.models.solution import Solution
from app.models.user import User


router = APIRouter(
    prefix="/api/projects",
    tags=["Project Prototype"],
)


# ============================================================
# UPLOAD DIRECTORY
# ============================================================

UPLOAD_DIR = Path("uploads/prototypes")

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# HELPERS
# ============================================================

def get_role(
    current_user: User,
) -> str:
    return (
        current_user.role or ""
    ).strip().lower()


def get_project_university_id(
    project: Project,
    db: Session,
):
    """
    Determine project ownership through:

    Project
        ↓
    Solution
        ↓
    University
    """

    if not project.solution_id:
        return None

    solution = (
        db.query(Solution)
        .filter(
            Solution.id == project.solution_id
        )
        .first()
    )

    if not solution:
        return None

    return solution.university_id


def is_project_member(
    project_id: uuid.UUID,
    user_id: uuid.UUID,
    db: Session,
) -> bool:
    return (
        db.query(ProjectMember)
        .filter(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == user_id,
        )
        .first()
        is not None
    )


def is_project_creator(
    project: Project,
    current_user: User,
) -> bool:
    """
    The Faculty who created the project
    is the project owner/manager.
    """

    return project.created_by == current_user.id


def belongs_to_same_university(
    project: Project,
    current_user: User,
    db: Session,
) -> bool:
    if not current_user.university_id:
        return False

    project_university_id = get_project_university_id(
        project,
        db,
    )

    if not project_university_id:
        return False

    return (
        project_university_id
        == current_user.university_id
    )


# ============================================================
# PROTOTYPE UPLOAD PERMISSION
#
# Admin:
#     Any project.
#
# University:
#     Own university projects.
#
# Project Creator Faculty:
#     Own project.
#
# Other Faculty:
#     Must be a ProjectMember.
#
# Student:
#     Must be a ProjectMember.
#
# Other university:
#     Read-only.
# ============================================================

def can_upload_prototype(
    project: Project,
    current_user: User,
    db: Session,
) -> bool:

    role = get_role(current_user)

    # --------------------------------------------------------
    # ADMIN
    # --------------------------------------------------------

    if role == "admin":
        return True

    # --------------------------------------------------------
    # UNIVERSITY
    #
    # University can manage prototypes of its
    # own university's projects.
    # --------------------------------------------------------

    if role == "university":
        return belongs_to_same_university(
            project,
            current_user,
            db,
        )

    # --------------------------------------------------------
    # FACULTY
    #
    # Project creator can manage prototype.
    #
    # Another Faculty can work on the project
    # only if added as ProjectMember.
    # --------------------------------------------------------

    if role == "faculty":

        if is_project_creator(
            project,
            current_user,
        ):
            return True

        return is_project_member(
            project.id,
            current_user.id,
            db,
        )

    # --------------------------------------------------------
    # STUDENT
    #
    # Student can upload prototype only when
    # they are a member of the project.
    # --------------------------------------------------------

    if role == "student":
        return is_project_member(
            project.id,
            current_user.id,
            db,
        )

    return False


# ============================================================
# UPLOAD PROJECT PROTOTYPE
# ============================================================

@router.post(
    "/{project_id}/prototype"
)
async def upload_project_prototype(
    project_id: uuid.UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # --------------------------------------------------------
    # GET PROJECT
    # --------------------------------------------------------

    project = (
        db.query(Project)
        .filter(
            Project.id == project_id
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    # --------------------------------------------------------
    # AUTHORIZATION
    # --------------------------------------------------------

    if not can_upload_prototype(
        project,
        current_user,
        db,
    ):
        raise HTTPException(
            status_code=403,
            detail=(
                "You are not authorized to upload a "
                "prototype for this project"
            ),
        )

    # --------------------------------------------------------
    # VALIDATE FILE NAME
    # --------------------------------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Invalid file",
        )

    # --------------------------------------------------------
    # GET FILE EXTENSION
    # --------------------------------------------------------

    extension = Path(
        file.filename
    ).suffix.lower()

    allowed_extensions = {
        ".zip",
        ".apk",
        ".pdf",
        ".doc",
        ".docx",
        ".ppt",
        ".pptx",
        ".txt",
    }

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported prototype file type"
            ),
        )

    # --------------------------------------------------------
    # READ FILE
    # --------------------------------------------------------

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty",
        )

    # --------------------------------------------------------
    # STORE FILE
    # --------------------------------------------------------

    stored_filename = (
        f"{project_id}_"
        f"{uuid.uuid4().hex}"
        f"{extension}"
    )

    file_path = (
        UPLOAD_DIR / stored_filename
    )

    file_path.write_bytes(contents)

    # --------------------------------------------------------
    # CREATE URL
    # --------------------------------------------------------

    prototype_url = (
        f"/uploads/prototypes/"
        f"{stored_filename}"
    )

    # --------------------------------------------------------
    # SAVE PROTOTYPE INFORMATION
    # --------------------------------------------------------

    project.prototype_name = file.filename
    project.prototype_url = prototype_url

    db.commit()
    db.refresh(project)

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {
        "success": True,
        "prototype_name": project.prototype_name,
        "prototype_url": prototype_url,
    }