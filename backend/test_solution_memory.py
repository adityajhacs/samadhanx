from uuid import UUID

from app.core.database import SessionLocal
from app.services.ai.solution_memory import find_similar_solutions


PROBLEM_ID = UUID(
    "8fe8fc38-40aa-4213-af50-6b149ec75169"
)


db = SessionLocal()

try:
    results = find_similar_solutions(
        problem_id=PROBLEM_ID,
        db=db,
        limit=5
    )

    print("\nSolution Memory Recommendations:")

    for result in results:
        similarity = result["similarity"]

        if similarity >= 0.75:
            recommendation = "Strongly Recommended"
        elif similarity >= 0.55:
            recommendation = "Related Solution"
        else:
            recommendation = "Not Recommended"

        print({
            **result,
            "recommendation": recommendation
        })

finally:
    db.close()