from unittest.mock import patch
from pytest import raises

from app.services.ai.embedding import generate_embedding


def test_generate_embedding():
    mock_result = type(
        "MockResult",
        (),
        {
            "embeddings": [
                type(
                    "MockEmbedding",
                    (),
                    {"values": [0.1, 0.2, 0.3]}
                )()
            ]
        }
    )()

    with patch(
        "app.services.ai.embedding.client.models.embed_content",
        return_value=mock_result
    ) as mock_embed:
        result = generate_embedding("Water supply problem")

    assert result == [0.1, 0.2, 0.3]
    mock_embed.assert_called_once()


def test_generate_embedding_rejects_empty_input():
    with raises(ValueError, match="cannot be empty"):
        generate_embedding("")


def test_generate_embedding_rejects_non_string_input():
    with raises(ValueError, match="must be a string"):
        generate_embedding(None)


def test_generate_embedding_rejects_oversized_input():
    huge_text = "A" * 10001

    with raises(ValueError, match="too long"):
        generate_embedding(huge_text)


def test_generate_embedding_rejects_empty_embedding():
    mock_result = type(
        "MockResult",
        (),
        {"embeddings": []}
    )()

    with patch(
        "app.services.ai.embedding.client.models.embed_content",
        return_value=mock_result
    ):
        with raises(ValueError, match="empty embedding"):
            generate_embedding("Water supply problem")


def test_generate_embedding_handles_api_error():
    with patch(
        "app.services.ai.embedding.client.models.embed_content",
        side_effect=Exception("API error")
    ):
        with raises(
            RuntimeError,
            match="temporarily unavailable"
        ):
            generate_embedding("Water supply problem")