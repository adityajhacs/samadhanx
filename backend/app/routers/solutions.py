
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.auth import get_current_user

from app.models.solution import Solution
from app.models.problem import Problem
from app.models.university import University
from app.models.project import Project
from app.models.project_member import ProjectMember
from app.models.user import User

from app.schemas.solution import (
    SolutionCreate,
    SolutionUpdate,
    SolutionResponse,
)

from app.services.ai.embedding import generate_embedding


# ============================================================
# Solutions Router
# ============================================================

router = APIRouter(
    prefix="/api/solutions",
    tags=["Solutions"],
)


# ============================================================
# Problem -> Solutions Router
# ============================================================

problem_solutions_router = APIRouter(
    prefix="/api/problems",
    tags=["Solutions"],
)


# ============================================================
# Project -> Solutions Router
# ============================================================

project_solutions_router = APIRouter(
    prefix="/api/projects",
    tags=["Solutions"],
)


# ============================================================
# ROLE HELPERS
# ============================================================

def get_role(current_user: User) -> str:
    return (current_user.role or "").strip().lower()


def require_solution_portal_access(
    current_user: User,
):
    """
    University, Faculty and Student can VIEW solutions.

    VIEW access is not restricted by university.

    Therefore:
        University A -> can view University B solutions
        Faculty A    -> can view University B solutions
        Student A    -> can view University B solutions
    """

    role = get_role(current_user)

    if role not in {
        "university",
        "faculty",
        "student",
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only university, faculty, and student users "
                "can access solutions"
            ),
        )


def require_solution_write_role(
    current_user: User,
):
    """
    Basic role check for solution write operations.

    University, Faculty and Student are allowed through
    this basic check.

    Additional ownership/project-member authorization
    is handled separately.
    """

    role = get_role(current_user)

    if role not in {
        "university",
        "faculty",
        "student",
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only university, faculty, and student users "
                "can modify solutions"
            ),
        )


def require_solution_create_role(
    current_user: User,
):
    """
    Only University and Faculty can CREATE solutions.

    Students can view solutions but cannot create them.
    """

    role = get_role(current_user)

    if role not in {
        "university",
        "faculty",
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only university and faculty users "
                "can create solutions"
            ),
        )


def ensure_own_university(
    current_user: User,
    university_id: uuid.UUID | None,
):
    """
    Used for university-level solution ownership checks.

    A user cannot create/update a solution on behalf of
    another university.
    """

    if not university_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="University is required",
        )

    if not current_user.university_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="University is not linked to this user",
        )

    if current_user.university_id != university_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You can only modify solutions belonging "
                "to your own university"
            ),
        )


# ============================================================
# PROTOTYPE DETAIL VALIDATION
# ============================================================

def validate_prototype_details(
    prototype_status: str | None,
    prototype_description: str | None,
    how_it_works: str | None,
    key_features: str | None,
    problem_solution: str | None,
):
    """
    IDEA:
        Detailed prototype fields are optional.

    DESIGN / PROTOTYPE / FIELD_TEST / DEPLOYED:
        All four detailed fields are required.
    """

    if not prototype_status:
        return

    normalized_status = prototype_status.strip().upper()

    if normalized_status == "IDEA":
        return

    required_fields = {
        "prototype_description": prototype_description,
        "how_it_works": how_it_works,
        "key_features": key_features,
        "problem_solution": problem_solution,
    }

    missing_fields = [
        field
        for field, value in required_fields.items()
        if not value or not value.strip()
    ]

    if missing_fields:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                f"The following fields are required when "
                f"prototype_status is {normalized_status}: "
                + ", ".join(missing_fields)
            ),
        )


# ============================================================
# SOLUTION EMBEDDING HELPER
# ============================================================

def build_solution_embedding_text(
    solution_title: str | None,
    description: str | None,
    prototype_status: str | None,
    prototype_description: str | None,
    how_it_works: str | None,
    key_features: str | None,
    problem_solution: str | None,
) -> str:
    """
    Build the text representation used for solution embeddings.

    The embedding represents the actual solution content so that
    it can later be compared with problem embeddings.
    """

    return (
        f"Solution Title: {solution_title or ''}\n"
        f"Description: {description or ''}\n"
        f"Prototype Status: {prototype_status or ''}\n"
        f"Prototype Description: {prototype_description or ''}\n"
        f"How It Works: {how_it_works or ''}\n"
        f"Key Features: {key_features or ''}\n"
        f"Problem Solution: {problem_solution or ''}"
    )


def generate_solution_embedding(
    solution_title: str | None,
    description: str | None,
    prototype_status: str | None,
    prototype_description: str | None,
    how_it_works: str | None,
    key_features: str | None,
    problem_solution: str | None,
):
    """
    Generate an embedding for a solution.

    Raises HTTP 500 when embedding generation fails.
    """

    embedding_text = build_solution_embedding_text(
        solution_title=solution_title,
        description=description,
        prototype_status=prototype_status,
        prototype_description=prototype_description,
        how_it_works=how_it_works,
        key_features=key_features,
        problem_solution=problem_solution,
    )

    try:
        return generate_embedding(embedding_text)

    except Exception as error:
        print(
            "Solution embedding generation error:",
            error,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate solution embedding.",
        )


# ============================================================
# PROJECT UNIVERSITY HELPER
# ============================================================

def get_project_university_id(
    db: Session,
    project: Project,
):
    """
    Resolve the university that owns the project.

    Current project structure links a project to a solution,
    and the solution identifies its university.

    Returns None when the project has no university-linked
    solution.
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


# ============================================================
# PROJECT MEMBERSHIP HELPER
# ============================================================

def is_project_member(
    db: Session,
    project_id: uuid.UUID,
    user_id: uuid.UUID,
) -> bool:
    """
    Check whether a user is a member of the project.
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
# PROJECT SOLUTION WRITE ACCESS
# ============================================================

def can_modify_project_solution(
    db: Session,
    current_user: User,
    project: Project,
):
    """
    Determines whether the current user can modify a solution
    connected to a project.

    UNIVERSITY:
        Can manage projects/solutions belonging to its own
        university.

    FACULTY:
        Can modify if:
            1. They are the project creator/owner, OR
            2. They are a project member.

    STUDENT:
        Can modify only if they are a project member.

    Other university:
        Read-only.
    """

    role = get_role(current_user)

    project_university_id = get_project_university_id(
        db,
        project,
    )

    # --------------------------------------------------------
    # UNIVERSITY
    # --------------------------------------------------------

    if role == "university":

        if not current_user.university_id:
            return False

        return (
            project_university_id
            == current_user.university_id
        )

    # --------------------------------------------------------
    # FACULTY
    # --------------------------------------------------------

    if role == "faculty":

        # Project creator is the project owner/manager.
        if project.created_by == current_user.id:
            return True

        # Faculty can work on project if added as member.
        return is_project_member(
            db,
            project.id,
            current_user.id,
        )

    # --------------------------------------------------------
    # STUDENT
    # --------------------------------------------------------

    if role == "student":

        return is_project_member(
            db,
            project.id,
            current_user.id,
        )

    return False


# ============================================================
# SOLUTION WRITE ACCESS
# ============================================================

def ensure_solution_write_access(
    db: Session,
    current_user: User,
    solution: Solution,
):
    """
    Final authorization check for updating an existing solution.

    Project-linked solution:

        University -> own university project
        Faculty    -> project creator OR project member
        Student    -> project member only

    Non-project solution:

        University -> own university
        Faculty    -> own university
        Student    -> NOT allowed
    """

    role = get_role(current_user)

    require_solution_write_role(
        current_user
    )

    # --------------------------------------------------------
    # Project-linked solution
    # --------------------------------------------------------

    if solution.project_id:

        project = (
            db.query(Project)
            .filter(
                Project.id == solution.project_id
            )
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project linked to solution not found",
            )

        if not can_modify_project_solution(
            db,
            current_user,
            project,
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "You do not have permission to modify "
                    "this project's solution"
                ),
            )

        return project

    # --------------------------------------------------------
    # Solution without project
    # --------------------------------------------------------

    if role == "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Students can modify solutions only when "
                "they are members of the linked project"
            ),
        )

    ensure_own_university(
        current_user,
        solution.university_id,
    )

    return None


# ============================================================
# GET /api/solutions
#
# Get all solutions with optional filters.
#
# Supported:
# ?problem_id=
# ?university_id=
# ?project_id=
# ?prototype_status=
#
# VIEW ONLY
# ============================================================

@router.get(
    "",
    response_model=list[SolutionResponse],
)
def get_solutions(
    problem_id: uuid.UUID | None = None,
    university_id: uuid.UUID | None = None,
    project_id: uuid.UUID | None = None,
    prototype_status: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_solution_portal_access(
        current_user
    )

    query = db.query(Solution)

    if problem_id:
        query = query.filter(
            Solution.problem_id == problem_id
        )

    if university_id:
        query = query.filter(
            Solution.university_id == university_id
        )

    if project_id:
        query = query.filter(
            Solution.project_id == project_id
        )

    if prototype_status:
        query = query.filter(
            Solution.prototype_status
            == prototype_status
        )

    return (
        query
        .order_by(Solution.created_at.desc())
        .all()
    )


# ============================================================
# GET /api/solutions/{solution_id}
#
# Get one solution.
#
# VIEW ONLY
# ============================================================

@router.get(
    "/{solution_id}",
    response_model=SolutionResponse,
)
def get_solution(
    solution_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_solution_portal_access(
        current_user
    )

    solution = (
        db.query(Solution)
        .filter(
            Solution.id == solution_id
        )
        .first()
    )

    if not solution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solution not found",
        )

    return solution


# ============================================================
# POST /api/solutions
#
# Create a new solution.
#
# University + Faculty -> allowed
# Student              -> forbidden
# ============================================================

@router.post(
    "",
    response_model=SolutionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_solution(
    solution_data: SolutionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_solution_create_role(
        current_user
    )

    # --------------------------------------------------------
    # University must exist
    # --------------------------------------------------------

    university = (
        db.query(University)
        .filter(
            University.id
            == solution_data.university_id
        )
        .first()
    )

    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found",
        )

    # --------------------------------------------------------
    # User can only create for own university
    # --------------------------------------------------------

    ensure_own_university(
        current_user,
        solution_data.university_id,
    )

    # --------------------------------------------------------
    # Problem must exist
    # --------------------------------------------------------

    problem = (
        db.query(Problem)
        .filter(
            Problem.id
            == solution_data.problem_id
        )
        .first()
    )

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    # --------------------------------------------------------
    # Prototype detail validation
    # --------------------------------------------------------

    validate_prototype_details(
        solution_data.prototype_status,
        solution_data.prototype_description,
        solution_data.how_it_works,
        solution_data.key_features,
        solution_data.problem_solution,
    )

    # --------------------------------------------------------
    # Project validation
    # --------------------------------------------------------

    project = None

    if solution_data.project_id:

        project = (
            db.query(Project)
            .filter(
                Project.id
                == solution_data.project_id
            )
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )

        # ----------------------------------------------------
        # Project must be linked to same problem
        # ----------------------------------------------------

        if (
            project.problem_id
            and project.problem_id
            != solution_data.problem_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Project is not linked to this problem"
                ),
            )

        # ----------------------------------------------------
        # Project must belong to same university
        # ----------------------------------------------------

        project_university_id = (
            get_project_university_id(
                db,
                project,
            )
        )

        if (
            project_university_id
            and project_university_id
            != solution_data.university_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Project and solution belong "
                    "to different universities"
                ),
            )

        # ----------------------------------------------------
        # Existing project authorization
        # ----------------------------------------------------

        if not can_modify_project_solution(
            db,
            current_user,
            project,
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "You do not have permission to create "
                    "a solution for this project"
                ),
            )

    # --------------------------------------------------------
    # Generate solution embedding
    # --------------------------------------------------------

    solution_embedding = generate_solution_embedding(
        solution_title=solution_data.solution_title,
        description=solution_data.description,
        prototype_status=solution_data.prototype_status,
        prototype_description=solution_data.prototype_description,
        how_it_works=solution_data.how_it_works,
        key_features=solution_data.key_features,
        problem_solution=solution_data.problem_solution,
    )

    # --------------------------------------------------------
    # Create solution
    # --------------------------------------------------------

    solution = Solution(
        problem_id=solution_data.problem_id,
        university_id=solution_data.university_id,
        project_id=solution_data.project_id,
        solution_title=solution_data.solution_title,
        description=solution_data.description,
        prototype_status=solution_data.prototype_status,
        estimated_cost=solution_data.estimated_cost,
        prototype_description=(
            solution_data.prototype_description
        ),
        how_it_works=solution_data.how_it_works,
        key_features=solution_data.key_features,
        problem_solution=solution_data.problem_solution,
        funding_received=solution_data.funding_received,
        embedding=solution_embedding,
    )

    db.add(solution)
    db.commit()
    db.refresh(solution)

    return solution


# ============================================================
# PATCH /api/solutions/{solution_id}
#
# Update an existing solution.
# ============================================================

@router.patch(
    "/{solution_id}",
    response_model=SolutionResponse,
)
def update_solution(
    solution_id: uuid.UUID,
    solution_data: SolutionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # --------------------------------------------------------
    # Get solution
    # --------------------------------------------------------

    solution = (
        db.query(Solution)
        .filter(
            Solution.id == solution_id
        )
        .first()
    )

    if not solution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solution not found",
        )

    # --------------------------------------------------------
    # Existing solution authorization
    # --------------------------------------------------------

    ensure_solution_write_access(
        db,
        current_user,
        solution,
    )

    update_data = solution_data.model_dump(
        exclude_unset=True
    )

    # Nothing to update
    if not update_data:
        return solution

    # --------------------------------------------------------
    # Current / new problem
    # --------------------------------------------------------

    new_problem_id = update_data.get(
        "problem_id",
        solution.problem_id,
    )

    if new_problem_id is not None:

        problem = (
            db.query(Problem)
            .filter(
                Problem.id == new_problem_id
            )
            .first()
        )

        if not problem:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Problem not found",
            )

    # --------------------------------------------------------
    # Current / new university
    # --------------------------------------------------------

    new_university_id = update_data.get(
        "university_id",
        solution.university_id,
    )

    if new_university_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="University is required",
        )

    university = (
        db.query(University)
        .filter(
            University.id == new_university_id
        )
        .first()
    )

    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found",
        )

    # --------------------------------------------------------
    # Prevent ownership transfer
    # --------------------------------------------------------

    if (
        new_university_id
        != solution.university_id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You cannot transfer a solution "
                "to another university"
            ),
        )

    # --------------------------------------------------------
    # Student university check
    # --------------------------------------------------------

    if get_role(current_user) == "student":

        if (
            new_university_id
            != current_user.university_id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Students can only work within "
                    "their own university"
                ),
            )

    # --------------------------------------------------------
    # Current / new project
    # --------------------------------------------------------

    new_project_id = update_data.get(
        "project_id",
        solution.project_id,
    )

    new_project = None

    if new_project_id is not None:

        new_project = (
            db.query(Project)
            .filter(
                Project.id == new_project_id
            )
            .first()
        )

        if not new_project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )

        # ----------------------------------------------------
        # Project must belong to same problem
        # ----------------------------------------------------

        if (
            new_project.problem_id
            and new_problem_id
            and new_project.problem_id
            != new_problem_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Project is not linked to this problem"
                ),
            )

        # ----------------------------------------------------
        # Project must belong to same university
        # ----------------------------------------------------

        project_university_id = (
            get_project_university_id(
                db,
                new_project,
            )
        )

        if (
            project_university_id
            and project_university_id
            != new_university_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Project and solution belong "
                    "to different universities"
                ),
            )

        # ----------------------------------------------------
        # Existing project authorization
        # ----------------------------------------------------

        if not can_modify_project_solution(
            db,
            current_user,
            new_project,
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "You do not have permission to use "
                    "this project"
                ),
            )

        # ----------------------------------------------------
        # Existing student membership check
        # ----------------------------------------------------

        if get_role(current_user) == "student":

            if not is_project_member(
                db,
                new_project.id,
                current_user.id,
            ):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=(
                        "Students can only use solutions "
                        "for projects they are members of"
                    ),
                )

    else:

        # ----------------------------------------------------
        # Student cannot remove project association
        # ----------------------------------------------------

        if get_role(current_user) == "student":

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Students cannot remove a solution "
                    "from its project"
                ),
            )

    # --------------------------------------------------------
    # Prototype status + existing detailed values
    # --------------------------------------------------------

    new_prototype_status = update_data.get(
        "prototype_status",
        solution.prototype_status,
    )

    new_prototype_description = update_data.get(
        "prototype_description",
        solution.prototype_description,
    )

    new_how_it_works = update_data.get(
        "how_it_works",
        solution.how_it_works,
    )

    new_key_features = update_data.get(
        "key_features",
        solution.key_features,
    )

    new_problem_solution = update_data.get(
        "problem_solution",
        solution.problem_solution,
    )

    # --------------------------------------------------------
    # Validate prototype fields using final values
    # --------------------------------------------------------

    validate_prototype_details(
        new_prototype_status,
        new_prototype_description,
        new_how_it_works,
        new_key_features,
        new_problem_solution,
    )

    # --------------------------------------------------------
    # Determine final values for embedding
    # --------------------------------------------------------

    new_solution_title = update_data.get(
        "solution_title",
        solution.solution_title,
    )

    new_description = update_data.get(
        "description",
        solution.description,
    )

    # --------------------------------------------------------
    # Regenerate embedding when solution content changes
    # --------------------------------------------------------

    embedding_fields = {
        "solution_title",
        "description",
        "prototype_status",
        "prototype_description",
        "how_it_works",
        "key_features",
        "problem_solution",
    }

    should_regenerate_embedding = any(
        field in update_data
        for field in embedding_fields
    )

    new_embedding = None

    if should_regenerate_embedding:

        new_embedding = generate_solution_embedding(
            solution_title=new_solution_title,
            description=new_description,
            prototype_status=new_prototype_status,
            prototype_description=new_prototype_description,
            how_it_works=new_how_it_works,
            key_features=new_key_features,
            problem_solution=new_problem_solution,
        )

    # --------------------------------------------------------
    # Apply update
    # --------------------------------------------------------

    for field, value in update_data.items():
        setattr(
            solution,
            field,
            value,
        )

    if should_regenerate_embedding:
        solution.embedding = new_embedding

    db.commit()
    db.refresh(solution)

    return solution


# ============================================================
# GET /api/problems/{problem_id}/solutions
#
# Get all solutions for a specific problem.
#
# VIEW ONLY
# ============================================================

@problem_solutions_router.get(
    "/{problem_id}/solutions",
    response_model=list[SolutionResponse],
)
def get_problem_solutions(
    problem_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_solution_portal_access(
        current_user
    )

    # --------------------------------------------------------
    # Check problem
    # --------------------------------------------------------

    problem = (
        db.query(Problem)
        .filter(
            Problem.id == problem_id
        )
        .first()
    )

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    # --------------------------------------------------------
    # All universities' solutions are visible
    # --------------------------------------------------------

    solutions = (
        db.query(Solution)
        .filter(
            Solution.problem_id == problem_id
        )
        .order_by(Solution.created_at.desc())
        .all()
    )

    return solutions


# ============================================================
# GET /api/projects/{project_id}/solutions
#
# Get all solutions for a project.
#
# VIEW ONLY
#
# Any University / Faculty / Student can view.
# Membership is NOT required for viewing.
# ============================================================

@project_solutions_router.get(
    "/{project_id}/solutions",
    response_model=list[SolutionResponse],
)
def get_project_solutions(
    project_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    require_solution_portal_access(
        current_user
    )

    # --------------------------------------------------------
    # Check project
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    # --------------------------------------------------------
    # All portal users can view project solutions.
    # No membership check here.
    # --------------------------------------------------------

    solutions = (
        db.query(Solution)
        .filter(
            Solution.project_id == project_id
        )
        .order_by(Solution.created_at.desc())
        .all()
    )

    return solutions

