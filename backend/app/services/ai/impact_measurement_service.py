from uuid import UUID

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.ai.impact_measurement import analyze_impact_metrics


def run_impact_measurement(
    solution_id: UUID,
    metrics: str,
    db: Session
):
    # Run AI Impact Measurement
    analysis = analyze_impact_metrics(metrics)

    # Save analysis in database
    result = db.execute(
        text("""
            INSERT INTO impact_measurements (
                solution_id,
                raw_metrics,
                overall_impact,
                key_improvements,
                areas_of_concern,
                impact_score,
                interpretation,
                confidence,
                uncertainty_notes
            )
            VALUES (
                :solution_id,
                :raw_metrics,
                :overall_impact,
                :key_improvements,
                :areas_of_concern,
                :impact_score,
                :interpretation,
                :confidence,
                :uncertainty_notes
            )
            RETURNING id
        """),
        {
            "solution_id": str(solution_id),
            "raw_metrics": metrics,
            "overall_impact": analysis.overall_impact,
            "key_improvements": analysis.key_improvements,
            "areas_of_concern": analysis.areas_of_concern,
            "impact_score": analysis.impact_score,
            "interpretation": analysis.interpretation,
            "confidence": analysis.confidence,
            "uncertainty_notes": analysis.uncertainty_notes,
        }
    )

    measurement_id = result.scalar_one()

    db.commit()

    return {
        "id": measurement_id,
        "solution_id": solution_id,
        "raw_metrics": metrics,
        "overall_impact": analysis.overall_impact,
        "key_improvements": analysis.key_improvements,
        "areas_of_concern": analysis.areas_of_concern,
        "impact_score": analysis.impact_score,
        "interpretation": analysis.interpretation,
        "confidence": analysis.confidence,
        "uncertainty_notes": analysis.uncertainty_notes,
    }