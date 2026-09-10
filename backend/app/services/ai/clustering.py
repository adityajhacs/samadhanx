import uuid
from sqlalchemy import text
from sqlalchemy.orm import Session


SIMILARITY_THRESHOLD = 0.85


def find_similar_problems(
    problem_id,
    db: Session
):
    query = text("""
        SELECT
            p.id,
            p.title,
            p.description,
            p.district,
            p.category,
            p.severity_score,
            ROUND(
                (1 - (p.embedding <=> target.embedding))::numeric,
                4
            ) AS similarity
        FROM public.problems p
        CROSS JOIN (
            SELECT embedding
            FROM public.problems
            WHERE id = :problem_id
        ) target
        WHERE p.embedding IS NOT NULL
          AND p.id != :problem_id
          AND (1 - (p.embedding <=> target.embedding)) >= :threshold
        ORDER BY p.embedding <=> target.embedding
    """)

    result = db.execute(
        query,
        {
            "problem_id": str(problem_id),
            "threshold": SIMILARITY_THRESHOLD
        }
    )

    return [
        {
            "id": row.id,
            "title": row.title,
            "description": row.description,
            "district": row.district,
            "category": row.category,
            "severity_score": row.severity_score,
            "similarity": float(row.similarity)
        }
        for row in result
    ]


def build_problem_clusters(db: Session):
    """
    Build clusters of similar civic problems using embeddings.

    Problems with similarity >= SIMILARITY_THRESHOLD
    are grouped into the same cluster.
    """

    # Get all problems having embeddings
    problems = db.execute(
        text("""
            SELECT id
            FROM public.problems
            WHERE embedding IS NOT NULL
        """)
    ).fetchall()

    problem_ids = [row.id for row in problems]

    if not problem_ids:
        return []

    # Find connected groups of similar problems
    visited = set()
    clusters = []

    for problem_id in problem_ids:

        if problem_id in visited:
            continue

        cluster = set()
        queue = [problem_id]

        while queue:

            current_id = queue.pop()

            if current_id in visited:
                continue

            visited.add(current_id)
            cluster.add(current_id)

            similar = find_similar_problems(
                current_id,
                db
            )

            for item in similar:

                similar_id = item["id"]

                if similar_id not in visited:
                    queue.append(similar_id)

        # Only create a cluster if at least 2 problems are related
        if len(cluster) >= 2:
            clusters.append(cluster)

    # Remove old generated clusters
    db.execute(
        text("""
            DELETE FROM public.problem_clusters
        """)
    )

    created_clusters = []

    for index, cluster in enumerate(clusters, start=1):

        cluster_id = uuid.uuid4()

        # Temporary name.
        # Gemini will generate the meaningful theme later.
        cluster_name = f"Problem Cluster {index}"

        db.execute(
            text("""
                INSERT INTO public.problem_clusters (
                    id,
                    name
                )
                VALUES (
                    :id,
                    :name
                )
            """),
            {
                "id": cluster_id,
                "name": cluster_name
            }
        )

        for problem_id in cluster:

            db.execute(
                text("""
                    INSERT INTO public.cluster_problems (
                        cluster_id,
                        problem_id
                    )
                    VALUES (
                        :cluster_id,
                        :problem_id
                    )
                """),
                {
                    "cluster_id": cluster_id,
                    "problem_id": problem_id
                }
            )

        created_clusters.append(
            {
                "cluster_id": cluster_id,
                "name": cluster_name,
                "problem_ids": list(cluster)
            }
        )

    db.commit()

    return created_clusters