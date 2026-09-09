import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.problem import Problem
from app.models.user import User
from app.services.ai.root_cause import analyze_root_cause


router = APIRouter(
    prefix="/api",
    tags=["Root Cause Analysis"],
)


@router.post(
    "/problems/{problem_id}/root-cause",
)
def analyze_problem_root_cause(
    problem_id: uuid.UUID,
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
        analysis = analyze_root_cause(problem_text)

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
        "symptom": analysis.symptom,
        "possible_causes": analysis.possible_causes,
        "contributing_factors": analysis.contributing_factors,
        "confidence": analysis.confidence,
        "need_field_verification": analysis.need_field_verification,
    }