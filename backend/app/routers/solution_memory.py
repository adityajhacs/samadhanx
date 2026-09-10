import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.problem import Problem
from app.models.user import User
from app.schemas.solution_memory import SolutionMemoryResponse
from app.services.ai.solution_memory import find_similar_solutions


router = APIRouter(
    prefix="/api",
    tags=["Solution Memory"],
)


@router.get(
    "/problems/{problem_id}/solution-memory",
    response_model=SolutionMemoryResponse,
)
def get_solution_memory(
    problem_id: uuid.UUID,
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Validate limit
    if limit < 1 or limit > 20:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Limit must be between 1 and 20",
        )

    # Check problem exists
    problem = (
        db.query(Problem)
        .filter(Problem.id == problem_id)
        .first()
    )

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    # Use existing M4 Solution Memory service
    results = find_similar_solutions(
        problem_id=problem_id,
        db=db,
        limit=limit,
    )

    return SolutionMemoryResponse(
        problem_id=problem_id,
        count=len(results),
        solutions=results,
    )