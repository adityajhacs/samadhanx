import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.solution import Solution
from app.models.problem import Problem
from app.models.university import University
from app.schemas.solution import (
    SolutionCreate,
    SolutionUpdate,
    SolutionResponse,
)
from app.core.auth import get_current_user
from app.models.user import User

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
# ?prototype_status=
# ============================================================

@router.get(
    "",
    response_model=list[SolutionResponse]
)
def get_solutions(
    problem_id: uuid.UUID | None = None,
    university_id: uuid.UUID | None = None,
    prototype_status: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Solution)

    # --------------------------------------------------------
    # Filter by problem
    # --------------------------------------------------------

    if problem_id:
        query = query.filter(
            Solution.problem_id == problem_id
        )

    # --------------------------------------------------------
    # Filter by university
    # --------------------------------------------------------

    if university_id:
        query = query.filter(
            Solution.university_id == university_id
        )

    # --------------------------------------------------------
    # Filter by prototype status
    # --------------------------------------------------------

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
    if current_user.role not in ALLOWED_SOLUTION_WRITE_ROLES:
         raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
           detail="You are not authorized to create a solution",
      )
    # --------------------------------------------------------
    # Check whether the problem exists
    # --------------------------------------------------------

    problem = (
        db.query(Problem)
        .filter(Problem.id == solution_data.problem_id)
        .first()
    )

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    # --------------------------------------------------------
    # Check whether the university exists
    # --------------------------------------------------------

    university = (
        db.query(University)
        .filter(University.id == solution_data.university_id)
        .first()
    )

    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found",
        )

    # --------------------------------------------------------
    # Create solution
    # --------------------------------------------------------

    solution = Solution(
        problem_id=solution_data.problem_id,
        university_id=solution_data.university_id,
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
    if current_user.role not in ALLOWED_SOLUTION_WRITE_ROLES:
       raise HTTPException(
          status_code=status.HTTP_403_FORBIDDEN,
          detail="You are not authorized to update a solution",
        )
    # --------------------------------------------------------
    # Check whether the solution exists
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # Get only fields that were actually provided
    # --------------------------------------------------------

    update_data = solution_data.model_dump(
        exclude_unset=True
    )

    # --------------------------------------------------------
    # If problem_id is being updated,
    # check whether the new problem exists
    # --------------------------------------------------------

    if (
        "problem_id" in update_data
        and update_data["problem_id"] is not None
    ):
        problem = (
            db.query(Problem)
            .filter(Problem.id == update_data["problem_id"])
            .first()
        )

        if not problem:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Problem not found",
            )

    # --------------------------------------------------------
    # If university_id is being updated,
    # check whether the new university exists
    # --------------------------------------------------------

    if (
        "university_id" in update_data
        and update_data["university_id"] is not None
    ):
        university = (
            db.query(University)
            .filter(University.id == update_data["university_id"])
            .first()
        )

        if not university:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="University not found",
            )

    # --------------------------------------------------------
    # Update provided fields
    # --------------------------------------------------------

    for field, value in update_data.items():
        setattr(solution, field, value)

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
    solutions = (
        db.query(Solution)
        .filter(Solution.problem_id == problem_id)
        .all()
    )

    return solutions