from app.core.database import SessionLocal
from sqlalchemy import text


PROBLEM_ID = "8fe8fc38-40aa-4213-af50-6b149ec75169"

SOLUTION_ID = "2b1c226d-dda2-4752-88f5-05a1e19effca"


db = SessionLocal()

try:
    # Create optimization record
    optimization = db.execute(
        text("""
            INSERT INTO resource_optimizations (
                problem_id,
                overall_recommendation
            )
            VALUES (
                :problem_id,
                :overall_recommendation
            )
            RETURNING id
        """),
        {
            "problem_id": PROBLEM_ID,
            "overall_recommendation": (
                "Solar Powered Smart Water ATM is recommended "
                "as the top-priority solution."
            ),
        },
    )

    optimization_id = optimization.scalar_one()

    # Create ranked solution record
    db.execute(
        text("""
            INSERT INTO resource_optimization_items (
                optimization_id,
                solution_id,
                priority_rank,
                priority_score,
                expected_impact,
                cost_efficiency,
                scalability,
                recommendation_reason,
                key_tradeoffs,
                confidence,
                uncertainty_notes
            )
            VALUES (
                :optimization_id,
                :solution_id,
                :priority_rank,
                :priority_score,
                :expected_impact,
                :cost_efficiency,
                :scalability,
                :recommendation_reason,
                :key_tradeoffs,
                :confidence,
                :uncertainty_notes
            )
        """),
        {
            "optimization_id": optimization_id,
            "solution_id": SOLUTION_ID,
            "priority_rank": 1,
            "priority_score": 88,
            "expected_impact": "High",
            "cost_efficiency": "High",
            "scalability": "High",
            "recommendation_reason": (
                "Provides a scalable solution with high impact "
                "and reasonable feasibility."
            ),
            "key_tradeoffs": [
                "Higher initial technology investment",
                "Requires technical maintenance",
            ],
            "confidence": 85,
            "uncertainty_notes": (
                "Local technical support availability is uncertain."
            ),
        },
    )

    db.commit()

    print("\nResource Optimization DB Insert: SUCCESS")
    print("Optimization ID:", optimization_id)

finally:
    db.close()