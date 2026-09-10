import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.solution import Solution
from app.models.user import User
from app.schemas.pilot_analysis import (
    PilotAnalysisRequest,
    PilotAnalysisResponse,
)
from app.services.ai.pilot_analysis import analyze_pilot_feedback


router = APIRouter(
    prefix="/api",
    tags=["Pilot Analysis"],
)


@router.post(
    "/solutions/{solution_id}/pilot-analysis",
    response_model=PilotAnalysisResponse,
)
def analyze_solution_pilot(
    solution_id: uuid.UUID,
    request: PilotAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check solution exists
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

    try:
        result = analyze_pilot_feedback(
            feedback=request.feedback
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
        "solution_id": str(solution_id),
        "sentiment": result.sentiment,
        "themes": result.themes,
        "common_issues": result.common_issues,
        "pilot_insight": result.pilot_insight,
        "confidence": result.confidence,
        "uncertainty_notes": result.uncertainty_notes,
    }