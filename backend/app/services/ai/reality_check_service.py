from uuid import UUID

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.ai.reality_check import analyze_reality_check


def run_reality_check(
    solution_id: UUID,
    solution: str,
    db: Session
):
    # Run AI RealityCheck
    analysis = analyze_reality_check(solution)

    # Save main RealityCheck result
    reality_check_result = db.execute(
        text("""
            INSERT INTO reality_checks (
                solution_id,
                feasibility_score,
                overall_summary,
                confidence,
                uncertainty_notes
            )
            VALUES (
                :solution_id,
                :feasibility_score,
                :overall_summary,
                :confidence,
                :uncertainty_notes
            )
            RETURNING id
        """),
        {
            "solution_id": str(solution_id),
            "feasibility_score": analysis.feasibility_score,
            "overall_summary": analysis.overall_summary,
            "confidence": analysis.confidence,
            "uncertainty_notes": analysis.uncertainty_notes,
        }
    )

    reality_check_id = reality_check_result.scalar_one()

    # Save individual risks
    for risk in analysis.risks:
        db.execute(
            text("""
                INSERT INTO solution_risks (
                    reality_check_id,
                    risk_category,
                    risk_description,
                    risk_level,
                    impact,
                    mitigation
                )
                VALUES (
                    :reality_check_id,
                    :risk_category,
                    :risk_description,
                    :risk_level,
                    :impact,
                    :mitigation
                )
            """),
            {
                "reality_check_id": str(reality_check_id),
                "risk_category": risk.risk_category,
                "risk_description": risk.risk_description,
                "risk_level": risk.risk_level,
                "impact": risk.impact,
                "mitigation": risk.mitigation,
            }
        )

    db.commit()

    return {
        "id": reality_check_id,
        "solution_id": solution_id,
        "feasibility_score": analysis.feasibility_score,
        "overall_summary": analysis.overall_summary,
        "confidence": analysis.confidence,
        "uncertainty_notes": analysis.uncertainty_notes,
        "risks": [
            risk.model_dump()
            for risk in analysis.risks
        ],
    }