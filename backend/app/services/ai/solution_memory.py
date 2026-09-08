from uuid import UUID

from sqlalchemy import text
from sqlalchemy.orm import Session


def find_similar_solutions(
    problem_id: UUID,
    db: Session,
    limit: int = 5
):
    # Get problem embedding
    problem = db.execute(
        text("""
            SELECT embedding
            FROM public.problems
            WHERE id = :problem_id
        """),
        {
            "problem_id": str(problem_id)
        }
    ).mappings().first()

    if not problem:
        return []

    if problem["embedding"] is None:
        return []

    query = text("""
        SELECT
            s.id,
            s.solution_title,
            s.prototype_status,
            s.estimated_cost,
            s.funding_received,
            ROUND(
                (1 - (s.embedding <=> p.embedding))::numeric,
                4
            ) AS similarity
        FROM public.solutions s
        CROSS JOIN (
            SELECT embedding
            FROM public.problems
            WHERE id = :problem_id
        ) p
        WHERE s.embedding IS NOT NULL
        ORDER BY s.embedding <=> p.embedding
        LIMIT :limit
    """)

    result = db.execute(
        query,
        {
            "problem_id": str(problem_id),
            "limit": limit
        }
    )

    recommendations = []

    for row in result:
        similarity = float(row.similarity)

        if similarity >= 0.75:
            recommendation = "Strongly Recommended"
        elif similarity >= 0.55:
            recommendation = "Related Solution"
        else:
            recommendation = "Not Recommended"

        recommendations.append({
            "id": row.id,
            "solution_title": row.solution_title,
            "prototype_status": row.prototype_status,
            "estimated_cost": (
                float(row.estimated_cost)
                if row.estimated_cost is not None
                else None
            ),
            "funding_received": (
                float(row.funding_received)
                if row.funding_received is not None
                else None
            ),
            "similarity": similarity,
            "recommendation": recommendation
        })

    return recommendations