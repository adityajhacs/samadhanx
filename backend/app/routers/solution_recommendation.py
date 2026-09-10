import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.problem import Problem
from app.models.solution import Solution
from app.models.user import User
from app.schemas.solution_recommendation import (
    SolutionRecommendationResponse,
)
from app.services.ai.solution_memory import find_similar_solutions
from app.services.ai.solution_recommendation import (
    explain_solution_recommendation,
)


router = APIRouter(
    prefix="/api",
    tags=["Solution Recommendation"],
)


@router.post(
    "/problems/{problem_id}/solution-recommendation/{solution_id}",
    response_model=SolutionRecommendationResponse,
)
def get_solution_recommendation(
    problem_id: uuid.UUID,
    solution_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check problem
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

    # Check solution
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

    # Make sure the solution belongs to this problem
    if solution.problem_id != problem_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solution does not belong to this problem",
        )

    # Get similar solutions and find the requested solution's similarity
    similar_solutions = find_similar_solutions(
        problem_id=problem_id,
        db=db,
        limit=20,
    )

    matching_solution = next(
        (
            item
            for item in similar_solutions
            if item["id"] == solution_id
        ),
        None,
    )

    if not matching_solution:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Similarity could not be calculated for this solution. "
                "Make sure both problem and solution have embeddings."
            ),
        )

    similarity = float(matching_solution["similarity"])

    # Build problem text for the AI
    problem_text = ""

    if hasattr(problem, "title") and problem.title:
        problem_text += problem.title

    if hasattr(problem, "description") and problem.description:
        if problem_text:
            problem_text += "\n\n"
        problem_text += problem.description

    if not problem_text.strip():
        problem_text = str(problem_id)

    # Solution model currently stores solution_title as the main text
    solution_text = solution.solution_title

    if not solution_text or not solution_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solution does not contain enough information",
        )

    try:
        recommendation = explain_solution_recommendation(
            problem=problem_text,
            solution=solution_text,
            similarity=similarity,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc

    return {
        "problem_id": problem_id,
        "solution_id": solution_id,
        "similarity": similarity,
        "relevance_explanation": (
            recommendation.relevance_explanation
        ),
        "compatibility_score": (
            recommendation.compatibility_score
        ),
        "key_matches": recommendation.key_matches,
        "limitations": recommendation.limitations,
        "confidence": recommendation.confidence,
    }