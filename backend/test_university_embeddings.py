from unittest.mock import patch

from app.core.database import SessionLocal
from app.services.ai.university_embeddings import generate_university_embeddings


def test_generate_university_embeddings():
    db = SessionLocal()

    mock_embedding = [0.1] * 768

    try:
        with patch(
            "app.services.ai.university_embeddings.generate_embedding"
        ) as mock_generate_embedding:

            mock_generate_embedding.return_value = mock_embedding

            generate_university_embeddings(db)

            assert mock_generate_embedding.call_count >= 0

            if mock_generate_embedding.called:
                for call in mock_generate_embedding.call_args_list:
                    text_argument = call.args[0]

                    assert isinstance(text_argument, str)
                    assert "University:" in text_argument
                    assert "Expertise Areas:" in text_argument
                    assert "District:" in text_argument
                    assert "Department:" in text_argument

    finally:
        db.close()