from sqlalchemy import text
from sqlalchemy.orm import Session
from uuid import UUID


def match_universities(
    problem_id: UUID,
    db: Session,
    limit: int = 5
):
    query = text("""
        SELECT
            u.id,
            u.name,
            u.expertise_areas,
            u.district,
            u.department,
            ROUND(
                (1 - (u.embedding <=> p.embedding))::numeric,
                4
            ) AS similarity
        FROM public.universities u
        CROSS JOIN (
            SELECT embedding
            FROM public.problems
            WHERE id = :problem_id
        ) p
        WHERE u.embedding IS NOT NULL
        ORDER BY u.embedding <=> p.embedding
        LIMIT :limit
    """)

    result = db.execute(
        query,
        {
            "problem_id": str(problem_id),
            "limit": limit
        }
    )

    return [
        {
            "id": row.id,
            "name": row.name,
            "expertise_areas": row.expertise_areas,
            "district": row.district,
            "department": row.department,
            "similarity": float(row.similarity)
        }
        for row in result
    ]