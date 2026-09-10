from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.ai.embedding import generate_embedding


def generate_university_embeddings(db: Session):
    """
    Generate and save 768-dimensional embeddings
    for universities that do not have an embedding.
    """

    universities = db.execute(
        text("""
            SELECT
                id,
                name,
                expertise_areas,
                district,
                department
            FROM public.universities
            WHERE embedding IS NULL
        """)
    ).mappings().all()

    print(f"Universities without embeddings: {len(universities)}")

    for university in universities:

        expertise = university["expertise_areas"] or []

        university_text = f"""
University: {university['name']}

Expertise Areas: {", ".join(expertise)}

District: {university['district']}

Department: {university['department']}
"""

        embedding = generate_embedding(university_text)

        db.execute(
            text("""
                UPDATE public.universities
                SET embedding = :embedding
                WHERE id = :university_id
            """),
            {
                "embedding": embedding,
                "university_id": str(university["id"])
            }
        )

        print(
            f"Embedding generated: {university['id']} - {university['name']}"
        )

    db.commit()

    print("All university embeddings saved successfully!")