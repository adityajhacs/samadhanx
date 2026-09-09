from uuid import UUID

from app.core.database import SessionLocal
from app.services.ai.solution_memory import find_similar_solutions


PROBLEM_ID = UUID(
    "8fe8fc38-40aa-4213-af50-6b149ec75169"
)


def test_find_similar_solutions():
    db = SessionLocal()

    try:
        results = find_similar_solutions(
            problem_id=PROBLEM_ID,
            db=db,
            limit=5
        )

        assert results is not None
        assert isinstance(results, list)

        if results:
            first_result = results[0]

            assert "similarity" in first_result
            assert "id" in first_result
            assert "solution_title" in first_result

            similarity = first_result["similarity"]

            assert 0 <= similarity <= 1

    finally:
        db.close()