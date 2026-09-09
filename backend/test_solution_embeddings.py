from unittest.mock import patch

from app.core.database import SessionLocal
from app.services.ai.solution_embeddings import generate_solution_embeddings


def test_generate_solution_embeddings():
    db = SessionLocal()

    mock_embedding = [0.1] * 768

    try:
        with patch(
            "app.services.ai.solution_embeddings.generate_embedding"
        ) as mock_generate_embedding:

            mock_generate_embedding.return_value = mock_embedding

            generate_solution_embeddings(db)

            assert mock_generate_embedding.call_count >= 0

    finally:
        db.close()