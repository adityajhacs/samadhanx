import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.solution import Solution
from app.models.user import User
from app.schemas.reality_check import (
    RealityCheckResponse,
    RealityCheckRiskResponse,
)
from app.services.ai.reality_check_service import run_reality_check


router = APIRouter(
    prefix="/api",
    tags=["RealityCheck"],
)


@router.post(
    "/solutions/{solution_id}/reality-check",
    response_model=RealityCheckResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_reality_check(
    solution_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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

    # Only the university/project owner or admin can run RealityCheck
    allowed = (
        current_user.role == "ADMIN"
        or solution.university_id == current_user.id
    )

    if not allowed and solution.project_id:
        project_owner = db.execute(
            text("""
                SELECT created_by
                FROM public.projects
                WHERE id = :project_id
            """),
            {"project_id": str(solution.project_id)},
        ).scalar_one_or_none()

        allowed = project_owner == current_user.id

    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to run RealityCheck",
        )

    # Use the solution title as the MVP RealityCheck input.
    solution_text = solution.solution_title

    if not solution_text or not solution_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solution does not contain enough information for RealityCheck",
        )

    try:
        return run_reality_check(
            solution_id=solution_id,
            solution=solution_text,
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


@router.get(
    "/solutions/{solution_id}/reality-check",
    response_model=RealityCheckResponse,
)
def get_solution_reality_check(
    solution_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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

    result = db.execute(
        text("""
            SELECT
                id,
                solution_id,
                feasibility_score,
                overall_summary,
                confidence,
                uncertainty_notes,
                created_at
            FROM public.reality_checks
            WHERE solution_id = :solution_id
            ORDER BY created_at DESC
            LIMIT 1
        """),
        {"solution_id": str(solution_id)},
    ).mappings().first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RealityCheck not found for this solution",
        )

    risks = db.execute(
        text("""
            SELECT
                id,
                reality_check_id,
                risk_category,
                risk_description,
                risk_level,
                impact,
                mitigation,
                created_at
            FROM public.solution_risks
            WHERE reality_check_id = :reality_check_id
            ORDER BY created_at
        """),
        {"reality_check_id": str(result["id"])},
    ).mappings().all()

    return {
        "id": result["id"],
        "solution_id": result["solution_id"],
        "feasibility_score": result["feasibility_score"],
        "overall_summary": result["overall_summary"],
        "confidence": result["confidence"],
        "uncertainty_notes": result["uncertainty_notes"],
        "created_at": result["created_at"],
        "risks": [
            {
                "id": risk["id"],
                "reality_check_id": risk["reality_check_id"],
                "risk_category": risk["risk_category"],
                "risk_description": risk["risk_description"],
                "risk_level": risk["risk_level"],
                "impact": risk["impact"],
                "mitigation": risk["mitigation"],
                "created_at": risk["created_at"],
            }
            for risk in risks
        ],
    }


@router.get(
    "/reality-checks/{reality_check_id}",
    response_model=RealityCheckResponse,
)
def get_reality_check(
    reality_check_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = db.execute(
        text("""
            SELECT
                id,
                solution_id,
                feasibility_score,
                overall_summary,
                confidence,
                uncertainty_notes,
                created_at
            FROM public.reality_checks
            WHERE id = :reality_check_id
        """),
        {"reality_check_id": str(reality_check_id)},
    ).mappings().first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RealityCheck not found",
        )

    risks = db.execute(
        text("""
            SELECT
                id,
                reality_check_id,
                risk_category,
                risk_description,
                risk_level,
                impact,
                mitigation,
                created_at
            FROM public.solution_risks
            WHERE reality_check_id = :reality_check_id
            ORDER BY created_at
        """),
        {"reality_check_id": str(reality_check_id)},
    ).mappings().all()

    return {
        "id": result["id"],
        "solution_id": result["solution_id"],
        "feasibility_score": result["feasibility_score"],
        "overall_summary": result["overall_summary"],
        "confidence": result["confidence"],
        "uncertainty_notes": result["uncertainty_notes"],
        "created_at": result["created_at"],
        "risks": [
            {
                "id": risk["id"],
                "reality_check_id": risk["reality_check_id"],
                "risk_category": risk["risk_category"],
                "risk_description": risk["risk_description"],
                "risk_level": risk["risk_level"],
                "impact": risk["impact"],
                "mitigation": risk["mitigation"],
                "created_at": risk["created_at"],
            }
            for risk in risks
        ],
    }