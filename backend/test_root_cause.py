from unittest.mock import patch
from pytest import raises

from app.services.ai.root_cause import analyze_root_cause


def test_analyze_root_cause():
    mock_response = type(
        "MockResponse",
        (),
        {
            "output_text": """
            {
                "symptom": "Irregular water supply",
                "possible_causes": [
                    "Damaged pipeline",
                    "Low water pressure"
                ],
                "contributing_factors": [
                    "Poor maintenance"
                ],
                "confidence": 85,
                "need_field_verification": true
            }
            """
        },
    )()

    with patch(
        "app.services.ai.root_cause.client.interactions.create",
        return_value=mock_response,
    ) as mock_create:

        result = analyze_root_cause(
            "Residents are facing irregular water supply."
        )

        assert result.symptom == "Irregular water supply"
        assert result.confidence == 85
        assert result.need_field_verification is True

        mock_create.assert_called_once()


def test_analyze_root_cause_rejects_empty_input():
    with raises(ValueError, match="cannot be empty"):
        analyze_root_cause("")


def test_analyze_root_cause_rejects_non_string_input():
    with raises(ValueError, match="must be a string"):
        analyze_root_cause(None)


def test_analyze_root_cause_rejects_oversized_input():
    huge_problem = "A" * 10001

    with raises(ValueError, match="too long"):
        analyze_root_cause(huge_problem)