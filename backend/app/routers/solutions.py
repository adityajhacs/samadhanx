from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.ai.reality_check_service import run_reality_check


router = APIRouter()


@router.post("/{solution_id}/reality-check")
def create_reality_check(
    solution_id: UUID,
    db: Session = Depends(get_db)
):
    # Fetch solution
    solution = db.execute(
        text("""
            SELECT
                id,
                solution_title
            FROM public.solutions
            WHERE id = :solution_id
        """),
        {
            "solution_id": str(solution_id)
        }
    ).mappings().first()

    if not solution:
        raise HTTPException(
            status_code=404,
            detail="Solution not found"
        )

    # Run RealityCheck AI and save result
    result = run_reality_check(
        solution_id=solution_id,
        solution=solution["solution_title"],
        db=db
    )

    return result
  @router.get("/{solution_id}/reality-check")
def get_reality_check(
    solution_id: UUID,
    db: Session = Depends(get_db)
):
    reality_check = db.execute(
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
        {
            "solution_id": str(solution_id)
        }
    ).mappings().first()

    if not reality_check:
        raise HTTPException(
            status_code=404,
            detail="RealityCheck not found"
        )

    risks = db.execute(
        text("""
            SELECT
                id,
                risk_category,
                risk_description,
                risk_level,
                impact,
                mitigation
            FROM public.solution_risks
            WHERE reality_check_id = :reality_check_id
            ORDER BY created_at ASC
        """),
        {
            "reality_check_id": str(reality_check["id"])
        }
    ).mappings().all()

    return {
        "id": reality_check["id"],
        "solution_id": reality_check["solution_id"],
        "feasibility_score": reality_check["feasibility_score"],
        "overall_summary": reality_check["overall_summary"],
        "confidence": reality_check["confidence"],
        "uncertainty_notes": reality_check["uncertainty_notes"],
        "created_at": reality_check["created_at"],
        "risks": [dict(risk) for risk in risks]
    }