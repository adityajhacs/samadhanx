import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.auth import get_current_user

from app.models.solution import Solution
from app.models.problem import Problem
from app.models.university import University
from app.models.project import Project
from app.models.user import User

from app.schemas.solution import (
    SolutionCreate,
    SolutionUpdate,
    SolutionResponse,
)


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


ALLOWED_SOLUTION_WRITE_ROLES = {
    "CITIZEN",
    "UNIVERSITY",
    "STUDENT",
    "FACULTY",
    "INDUSTRY",
    "GOVERNMENT",
    "ADMIN",
}


# ============================================================
# GET /api/solutions
# Get all solutions with optional filters
#
# Supported filters:
# ?problem_id=
# ?university_id=
# ?project_id=
# ?prototype_status=
# ============================================================

@router.get(
    "",
    response_model=list[SolutionResponse]
)
def get_solutions(
    problem_id: uuid.UUID | None = None,
    university_id: uuid.UUID | None = None,
    project_id: uuid.UUID | None = None,
    prototype_status: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Solution)

    # Filter by problem
    if problem_id:
        query = query.filter(
            Solution.problem_id == problem_id
        )

    # Filter by university
    if university_id:
        query = query.filter(
            Solution.university_id == university_id
        )

    # Filter by project
    if project_id:
        query = query.filter(
            Solution.project_id == project_id
        )

    # Filter by prototype status
    if prototype_status:
        query = query.filter(
            Solution.prototype_status == prototype_status
        )

    solutions = query.all()

    return solutions


# ============================================================
# GET /api/solutions/{solution_id}
# Get one solution
# ============================================================

@router.get(
    "/{solution_id}",
    response_model=SolutionResponse
)
def get_solution(
    solution_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    solution = (
        db.query(Solution)
        .filter(Solution.id == solution_id)
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
# Create a new solution
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
    # --------------------------------------------------------
    # Check permission
    # --------------------------------------------------------

    if current_user.role not in ALLOWED_SOLUTION_WRITE_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to create a solution",
        )

    # --------------------------------------------------------
    # Check whether problem exists
    # --------------------------------------------------------

    problem = (
        db.query(Problem)
        .filter(
            Problem.id == solution_data.problem_id
        )
        .first()
    )

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    # --------------------------------------------------------
    # Check whether university exists
    # --------------------------------------------------------

    university = (
        db.query(University)
        .filter(
            University.id == solution_data.university_id
        )
        .first()
    )

    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found",
        )

    # --------------------------------------------------------
    # Check whether project exists
    # --------------------------------------------------------

    if solution_data.project_id:

        project = (
            db.query(Project)
            .filter(
                Project.id == solution_data.project_id
            )
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )

        # ----------------------------------------------------
        # Make sure project belongs to the same problem
        # ----------------------------------------------------

        if (
            project.problem_id
            and project.problem_id != solution_data.problem_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project is not linked to this problem",
            )

    # --------------------------------------------------------
    # Create solution
    # --------------------------------------------------------

    solution = Solution(
        problem_id=solution_data.problem_id,
        university_id=solution_data.university_id,
        project_id=solution_data.project_id,
        solution_title=solution_data.solution_title,
        prototype_status=solution_data.prototype_status,
        estimated_cost=solution_data.estimated_cost,
        funding_received=solution_data.funding_received,
    )

    db.add(solution)
    db.commit()
    db.refresh(solution)

    return solution


# ============================================================
# PATCH /api/solutions/{solution_id}
# Update an existing solution
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
    # Check permission
    # --------------------------------------------------------

    if current_user.role not in ALLOWED_SOLUTION_WRITE_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update a solution",
        )

    # --------------------------------------------------------
    # Check whether solution exists
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
    # Get only provided fields
    # --------------------------------------------------------

    update_data = solution_data.model_dump(
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
                Problem.id == update_data["problem_id"]
            )
            .first()
        )

        if not problem:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Problem not found",
            )

    # --------------------------------------------------------
    # Validate university
    # --------------------------------------------------------

    if (
        "university_id" in update_data
        and update_data["university_id"] is not None
    ):
        university = (
            db.query(University)
            .filter(
                University.id
                == update_data["university_id"]
            )
            .first()
        )

        if not university:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="University not found",
            )

    # --------------------------------------------------------
    # Validate project
    # --------------------------------------------------------

    if (
        "project_id" in update_data
        and update_data["project_id"] is not None
    ):
        project = (
            db.query(Project)
            .filter(
                Project.id
                == update_data["project_id"]
            )
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )

        # ----------------------------------------------------
        # Check project and problem compatibility
        # ----------------------------------------------------

        new_problem_id = update_data.get(
            "problem_id",
            solution.problem_id
        )

        if (
            project.problem_id
            and new_problem_id
            and project.problem_id != new_problem_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project is not linked to this problem",
            )

    # --------------------------------------------------------
    # Update fields
    # --------------------------------------------------------

    for field, value in update_data.items():
        setattr(
            solution,
            field,
            value
        )

    db.commit()
    db.refresh(solution)

    return solution


# ============================================================
# GET /api/problems/{problem_id}/solutions
# Get all solutions for a specific problem
# ============================================================

@problem_solutions_router.get(
    "/{problem_id}/solutions",
    response_model=list[SolutionResponse]
)
def get_problem_solutions(
    problem_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    # Check problem exists
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

    solutions = (
        db.query(Solution)
        .filter(
            Solution.problem_id == problem_id
        )
        .all()
    )

    return solutions


# ============================================================
# GET /api/projects/{project_id}/solutions
# Get all solutions for a project
# ============================================================

project_solutions_router = APIRouter(
    prefix="/api/projects",
    tags=["Solutions"],
)


@project_solutions_router.get(
    "/{project_id}/solutions",
    response_model=list[SolutionResponse]
)
def get_project_solutions(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    # Check project exists
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

    solutions = (
        db.query(Solution)
        .filter(
            Solution.project_id == project_id
        )
        .all()
    )

    return solutions