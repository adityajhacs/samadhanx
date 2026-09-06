from app.core.database import SessionLocal
from app.models.problem import Problem
from app.services.ai.embedding import generate_embedding


db = SessionLocal()

try:
    problems = (
        db.query(Problem)
        .filter(Problem.embedding.is_(None))
        .all()
    )

    print(f"Problems without embeddings: {len(problems)}")

    for problem in problems:
        text = f"""
Title: {problem.title}

Description: {problem.description}

District: {problem.district}
"""

        embedding = generate_embedding(text)

        problem.embedding = embedding

        print(
            f"Embedding generated: {problem.id} - {problem.title}"
        )

    db.commit()

    print("\nAll embeddings saved successfully!")

finally:
    db.close()