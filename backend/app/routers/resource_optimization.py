import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.problem import Problem
from app.models.user import User
from app.schemas.resource_optimization import (
    ResourceOptimizationRequest,
    ResourceOptimizationResponse,
)
from app.services.ai.resource_optimization import optimize_resources


router = APIRouter(
    prefix="/api",
    tags=["Resource Optimization"],
)


@router.post(
    "/problems/{problem_id}/resource-optimization",
    response_model=ResourceOptimizationResponse,
)
def optimize_problem_resources(
    problem_id: uuid.UUID,
    request: ResourceOptimizationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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

    problem_text = f"""
Title: {problem.title}

Description: {problem.description}

District: {problem.district}

Category: {problem.category}
"""

    try:
        result = optimize_resources(
            problem=problem_text,
            solutions=request.solutions,
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
        "problem_id": str(problem_id),
        "overall_recommendation": result.overall_recommendation,
        "ranked_solutions": [
            {
                "solution_name": item.solution_name,
                "priority_rank": item.priority_rank,
                "priority_score": item.priority_score,
                "expected_impact": item.expected_impact,
                "cost_efficiency": item.cost_efficiency,
                "scalability": item.scalability,
                "recommendation_reason": item.recommendation_reason,
                "key_tradeoffs": item.key_tradeoffs,
                "confidence": item.confidence,
                "uncertainty_notes": item.uncertainty_notes,
            }
            for item in result.ranked_solutions
        ],
    }