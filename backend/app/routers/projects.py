
import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Query,
)
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.core.auth import get_current_user

from app.models.project import Project
from app.models.project_member import ProjectMember
from app.models.problem import Problem
from app.models.solution import Solution
from app.models.university import University
from app.models.user import User

from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
)


router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"],
)


# ============================================================
# HELPERS
# ============================================================

def get_member_count(
    project_id: uuid.UUID,
    db: Session,
) -> int:
    return (
        db.query(func.count(ProjectMember.id))
        .filter(
            ProjectMember.project_id == project_id
        )
        .scalar()
        or 0
    )


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
    Resolve the university associated with a project.

    Current database structure:

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


def get_project_university_name(
    project: Project,
    db: Session,
) -> str | None:
    """
    Resolve the university name associated with a project.

    Current database structure:

        Project
            ↓
        Solution
            ↓
        University
    """

    university_id = get_project_university_id(
        project,
        db,
    )

    if not university_id:
        return None

    university = (
        db.query(University)
        .filter(
            University.id == university_id
        )
        .first()
    )

    if not university:
        return None

    return university.name

def get_project_problem_name(
    project: Project,
    db: Session,
) -> str | None:
    """
    Resolve the problem title associated with a project.
    """

    if not project.problem_id:
        return None

    problem = (
        db.query(Problem)
        .filter(
            Problem.id == project.problem_id
        )
        .first()
    )

    if not problem:
        return None

    return problem.title


def get_project_solution_name(
    project: Project,
    db: Session,
) -> str | None:
    """
    Resolve the solution title associated with a project.
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

    return solution.solution_title




def belongs_to_same_university(
    project: Project,
    current_user: User,
    db: Session,
) -> bool:
    """
    Check whether a project is associated with the
    current user's university.
    """

    if not current_user.university_id:
        return False

    project_university_id = (
        get_project_university_id(
            project,
            db,
        )
    )

    if not project_university_id:
        return False

    return (
        project_university_id
        == current_user.university_id
    )


# ============================================================
# PROJECT MEMBER HELPER
# ============================================================

def is_project_member(
    project_id: uuid.UUID,
    user_id: uuid.UUID,
    db: Session,
) -> bool:
    """
    Check whether a user is a member of a project.

    Membership does NOT make a Faculty member the project
    owner/manager. The creator remains the owner.
    """

    member = (
        db.query(ProjectMember)
        .filter(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == user_id,
        )
        .first()
    )

    return member is not None


# ============================================================
# PROJECT CREATION
# ============================================================

def can_create_project(
    current_user: User,
) -> bool:
    """
    Project creation permissions:

    University:
        Allowed.

    Faculty:
        Allowed.

    Student:
        Not allowed to create a core project.

    Admin:
        Allowed.
    """

    role = get_role(current_user)

    return role in {
        "university",
        "faculty",
        "admin",
    }


# ============================================================
# PROJECT CORE EDIT PERMISSION
# ============================================================

def can_edit_project(
    project: Project,
    current_user: User,
    db: Session,
) -> bool:
    """
    Core project editing permission.

    Admin:
        Can edit everything.

    Student:
        Cannot edit core project.

    Faculty:
        ONLY the Faculty who CREATED the project can
        manage/edit the core project.

        Being from the same university is NOT enough.

        Being a ProjectMember also does NOT make the
        Faculty member the project owner.

    University:
        Can edit projects belonging to its own university.
    """

    role = get_role(current_user)

    # --------------------------------------------------------
    # ADMIN
    # --------------------------------------------------------

    if role == "admin":
        return True

    # --------------------------------------------------------
    # STUDENT
    # --------------------------------------------------------

    if role == "student":
        return False

    # --------------------------------------------------------
    # FACULTY
    #
    # Only creator/owner can manage the core project.
    # --------------------------------------------------------

    if role == "faculty":
        return (
            project.created_by
            == current_user.id
        )

    # --------------------------------------------------------
    # UNIVERSITY
    #
    # University can manage its own university project.
    # --------------------------------------------------------

    if role == "university":
        return belongs_to_same_university(
            project,
            current_user,
            db,
        )

    return False


# ============================================================
# RESPONSE ENRICHMENT
# ============================================================


def enrich_project_response(
    project: Project,
    db: Session,
) -> Project:
    """
    Add calculated fields required by the frontend.

    These values are response-only and are NOT stored
    as database columns.

    Added:
        - member_count
        - university_name
        - problem_name
        - solution_name
    """

    project.member_count = get_member_count(
        project.id,
        db,
    )

    project.university_name = (
        get_project_university_name(
            project,
            db,
        )
    )

    project.problem_name = (
        get_project_problem_name(
            project,
            db,
        )
    )

    project.solution_name = (
        get_project_solution_name(
            project,
            db,
        )
    )

    return project


# ============================================================
# GET PROJECTS
#
# ALL AUTHENTICATED USERS CAN VIEW ALL PROJECTS.
#
# Membership is NOT required for viewing.
#
# Other university projects are READ ONLY.
# ============================================================

@router.get(
    "",
    response_model=list[ProjectResponse],
)
def get_projects(
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
    district: str | None = None,
    university_id: uuid.UUID | None = None,
    problem_id: uuid.UUID | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Project)

    # --------------------------------------------------------
    # Filter by status
    # --------------------------------------------------------

    if status_filter:
        query = query.filter(
            Project.status == status_filter
        )

    # --------------------------------------------------------
    # Filter by problem
    # --------------------------------------------------------

    if problem_id:
        query = query.filter(
            Project.problem_id == problem_id
        )

    # --------------------------------------------------------
    # Filter by university
    # --------------------------------------------------------

    if university_id:
        query = (
            query
            .join(
                Solution,
                Project.solution_id == Solution.id,
            )
            .filter(
                Solution.university_id
                == university_id
            )
        )

    # --------------------------------------------------------
    # Filter by district
    # --------------------------------------------------------

    if district:
        query = (
            query
            .join(
                Solution,
                Project.solution_id == Solution.id,
            )
            .join(
                University,
                Solution.university_id
                == University.id,
            )
            .filter(
                University.district
                == district
            )
        )

    projects = query.all()

    # --------------------------------------------------------
    # Add frontend response fields
    # --------------------------------------------------------

    for project in projects:
        enrich_project_response(
            project,
            db,
        )

    return projects


# ============================================================
# GET SINGLE PROJECT
#
# ALL AUTHENTICATED USERS CAN VIEW.
#
# No membership requirement.
# No university restriction.
# ============================================================

@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
)
def get_project(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    enrich_project_response(
        project,
        db,
    )

    return project


# ============================================================
# CREATE PROJECT
#
# University / Faculty / Admin
#
# Student:
#     Cannot create a core project.
#
# Faculty creator becomes the project owner through
# Project.created_by.
# ============================================================

@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not can_create_project(
        current_user
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Students cannot create core projects. "
                "Students can contribute to existing projects "
                "through project membership and permitted "
                "project work APIs."
            ),
        )

    role = get_role(current_user)

    # --------------------------------------------------------
    # Validate problem
    # --------------------------------------------------------

    if project_data.problem_id:

        problem = (
            db.query(Problem)
            .filter(
                Problem.id
                == project_data.problem_id
            )
            .first()
        )

        if not problem:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Problem not found",
            )

    # --------------------------------------------------------
    # Validate solution
    # --------------------------------------------------------

    if project_data.solution_id:

        solution = (
            db.query(Solution)
            .filter(
                Solution.id
                == project_data.solution_id
            )
            .first()
        )

        if not solution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Solution not found",
            )

        # ----------------------------------------------------
        # Non-admin users can create a project only for
        # their own university's solution.
        # ----------------------------------------------------

        if role != "admin":

            if not current_user.university_id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=(
                        "Your account is not linked "
                        "to a university"
                    ),
                )

            if (
                solution.university_id
                != current_user.university_id
            ):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=(
                        "You can only create a project "
                        "for your own university's solution"
                    ),
                )

        # ----------------------------------------------------
        # Project and solution must belong to same problem
        # ----------------------------------------------------

        if (
            project_data.problem_id
            and solution.problem_id
            and solution.problem_id
            != project_data.problem_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Solution is not linked "
                    "to this problem"
                ),
            )

    # --------------------------------------------------------
    # Create project
    #
    # IMPORTANT:
    # current_user.id is always stored as created_by.
    #
    # Therefore if Faculty creates it, that Faculty becomes
    # the project owner/manager.
    # --------------------------------------------------------

    project = Project(
        problem_id=project_data.problem_id,
        solution_id=project_data.solution_id,
        title=project_data.title,
        description=project_data.description,
        status=project_data.status,
        created_by=current_user.id,
        deadline=project_data.deadline,
        progress=project_data.progress,
        budget=project_data.budget,
        expected_impact=project_data.expected_impact,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    enrich_project_response(
        project,
        db,
    )

    return project


# ============================================================
# UPDATE PROJECT
#
# Student:
#     NOT allowed to edit core project.
#
# Faculty:
#     ONLY PROJECT CREATOR can edit core project.
#
#     Same university is NOT enough.
#     Project membership is NOT enough.
#
# University:
#     Own university projects only.
#
# Admin:
#     Everything.
# ============================================================

@router.patch(
    "/{project_id}",
    response_model=ProjectResponse,
)
def update_project(
    project_id: uuid.UUID,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    # --------------------------------------------------------
    # Authorization
    # --------------------------------------------------------

    if not can_edit_project(
        project,
        current_user,
        db,
    ):
        role = get_role(current_user)

        if role == "student":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Students cannot modify core project details. "
                    "Students can work only through permitted "
                    "project task, progress, and prototype APIs."
                ),
            )

        if role == "faculty":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Only the Faculty who created this project "
                    "can manage its core project details"
                ),
            )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized "
                "to modify this project"
            ),
        )

    # --------------------------------------------------------
    # Prepare update
    # --------------------------------------------------------

    update_data = project_data.model_dump(
        exclude_unset=True
    )

    # --------------------------------------------------------
    # Validate problem
    # --------------------------------------------------------

    if (
        "problem_id" in update_data
        and update_data["problem_id"] is not None
    ):

        problem = (
            db.query(Problem)
            .filter(
                Problem.id
                == update_data["problem_id"]
            )
            .first()
        )

        if not problem:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Problem not found",
            )

    # --------------------------------------------------------
    # Validate solution
    # --------------------------------------------------------

    if (
        "solution_id" in update_data
        and update_data["solution_id"] is not None
    ):

        solution = (
            db.query(Solution)
            .filter(
                Solution.id
                == update_data["solution_id"]
            )
            .first()
        )

        if not solution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Solution not found",
            )

        # ----------------------------------------------------
        # Non-admin users can associate only their own
        # university's solution.
        # ----------------------------------------------------

        if get_role(current_user) != "admin":

            if (
                not current_user.university_id
                or solution.university_id
                != current_user.university_id
            ):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=(
                        "You can only associate the project "
                        "with your own university's solution"
                    ),
                )

        # ----------------------------------------------------
        # Check problem compatibility
        # ----------------------------------------------------

        new_problem_id = update_data.get(
            "problem_id",
            project.problem_id,
        )

        if (
            solution.problem_id
            and new_problem_id
            and solution.problem_id
            != new_problem_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Solution is not linked "
                    "to this problem"
                ),
            )

    # --------------------------------------------------------
    # If problem is changed, make sure existing solution
    # remains compatible.
    # --------------------------------------------------------

    if (
        "problem_id" in update_data
        and update_data["problem_id"] is not None
        and "solution_id" not in update_data
        and project.solution_id
    ):

        existing_solution = (
            db.query(Solution)
            .filter(
                Solution.id
                == project.solution_id
            )
            .first()
        )

        if (
            existing_solution
            and existing_solution.problem_id
            and existing_solution.problem_id
            != update_data["problem_id"]
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "The selected problem is not compatible "
                    "with the project's solution"
                ),
            )

    # --------------------------------------------------------
    # Apply update
    # --------------------------------------------------------

    for field, value in update_data.items():
        setattr(
            project,
            field,
            value,
        )

    db.commit()
    db.refresh(project)

    enrich_project_response(
        project,
        db,
    )

    return project

