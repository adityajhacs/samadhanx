from uuid import UUID
from unittest.mock import patch

from app.core.database import SessionLocal
from app.services.ai.reality_check_service import run_reality_check
from app.services.ai.reality_check import RealityCheckAnalysis, RealityCheckRisk


SOLUTION_ID = UUID("2b1c226d-dda2-4752-88f5-05a1e19effca")


def test_run_reality_check_db():
    solution = """
    Install solar-powered smart water ATMs in villages
    to provide reliable drinking water access.

    The system will use solar energy, water purification,
    and a digital monitoring system to track water usage
    and maintenance requirements.
    """

    mock_result = RealityCheckAnalysis(
        feasibility_score=75,
        overall_summary="The solution is feasible with proper maintenance.",
        risks=[
            RealityCheckRisk(
                risk_category="Technical",
                risk_description="Equipment may malfunction.",
                risk_level="Medium",
                impact="Could interrupt water availability.",
                mitigation="Perform regular maintenance."
            ),
            RealityCheckRisk(
                risk_category="Operational",
                risk_description="Maintenance may be delayed.",
                risk_level="Medium",
                impact="Could increase downtime.",
                mitigation="Create local maintenance support."
            ),
        ],
        confidence=85,
        uncertainty_notes="Long-term maintenance requirements may vary."
    )

    db = SessionLocal()

    try:
        with patch(
            "app.services.ai.reality_check_service.analyze_reality_check"
        ) as mock_ai:

            mock_ai.return_value = mock_result

            result = run_reality_check(
                solution_id=SOLUTION_ID,
                solution=solution,
                db=db
            )

        assert result is not None
        assert result["feasibility_score"] == 75
        assert result["confidence"] == 85
        assert len(result["risks"]) == 2

        mock_ai.assert_called_once()

    finally:
        db.close()