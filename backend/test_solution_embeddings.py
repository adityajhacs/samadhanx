from app.core.database import SessionLocal
from app.services.ai.solution_embeddings import generate_solution_embeddings


db = SessionLocal()

try:
    generate_solution_embeddings(db)
finally:
    db.close()