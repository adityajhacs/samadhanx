import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.solution import Solution
from app.models.user import User
from app.schemas.impact_measurement import (
    ImpactMeasurementRequest,
    ImpactMeasurementResponse,
)
from app.services.ai.impact_measurement_service import (
    run_impact_measurement,
)


router = APIRouter(
    prefix="/api",
    tags=["Impact Measurement"],
)


@router.post(
    "/solutions/{solution_id}/impact-measurement",
    response_model=ImpactMeasurementResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_impact_measurement(
    solution_id: uuid.UUID,
    request: ImpactMeasurementRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check whether solution exists
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
        result = run_impact_measurement(
            solution_id=solution_id,
            metrics=request.metrics,
            db=db,
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

    return result


@router.get(
    "/solutions/{solution_id}/impact-measurement",
    response_model=ImpactMeasurementResponse,
)
def get_impact_measurement(
    solution_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check whether solution exists
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

    result = db.execute(
        text("""
            SELECT
                id,
                solution_id,
                raw_metrics,
                overall_impact,
                key_improvements,
                areas_of_concern,
                impact_score,
                interpretation,
                confidence,
                uncertainty_notes,
                created_at
            FROM public.impact_measurements
            WHERE solution_id = :solution_id
            ORDER BY created_at DESC
            LIMIT 1
        """),
        {
            "solution_id": str(solution_id)
        },
    ).mappings().first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Impact Measurement not found",
        )

    return result