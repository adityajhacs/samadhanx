from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.ai.embedding import generate_embedding


def generate_solution_embeddings(db: Session):
    """
    Generate and save 768-dimensional embeddings
    for solutions that do not have an embedding.
    """

    solutions = db.execute(
        text("""
            SELECT
                id,
                solution_title,
                prototype_status,
                estimated_cost,
                funding_received
            FROM public.solutions
            WHERE embedding IS NULL
        """)
    ).mappings().all()

    print(f"Solutions without embeddings: {len(solutions)}")

    for solution in solutions:

        solution_text = f"""
Solution: {solution['solution_title']}

Prototype Status: {solution['prototype_status']}

Estimated Cost: {solution['estimated_cost']}

Funding Received: {solution['funding_received']}
"""

        embedding = generate_embedding(solution_text)

        db.execute(
            text("""
                UPDATE public.solutions
                SET embedding = :embedding
                WHERE id = :solution_id
            """),
            {
                "embedding": embedding,
                "solution_id": str(solution["id"])
            }
        )

        print(
            f"Embedding generated: "
            f"{solution['id']} - {solution['solution_title']}"
        )

    db.commit()

    print("All solution embeddings saved successfully!")