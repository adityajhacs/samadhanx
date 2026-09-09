from unittest.mock import patch

from app.services.ai.solution_recommendation import (
    explain_solution_recommendation
)


def test_explain_solution_recommendation():
    problem = """
    Residents in rural villages are facing unreliable access
    to clean drinking water.
    """

    solution = """
    Solar-powered smart water ATMs provide purified drinking
    water using solar energy, water purification and digital
    monitoring.
    """

    similarity = 0.5946

    mock_output = """
    {
        "relevance_explanation": "The previous solution is relevant because both the civic problem and the solution focus on improving access to clean drinking water.",
        "compatibility_score": 75,
        "key_matches": [
            "Clean drinking water access",
            "Water purification",
            "Rural water supply"
        ],
        "limitations": [
            "The solution may require local maintenance support",
            "The available information does not confirm long-term suitability"
        ],
        "confidence": 85,
        "uncertainty_notes": "The recommendation is based only on the provided problem and solution descriptions."
    }
    """

    with patch(
        "app.services.ai.solution_recommendation.client.interactions.create"
    ) as mock_create:
        mock_create.return_value.output_text = mock_output

        result = explain_solution_recommendation(
            problem=problem,
            solution=solution,
            similarity=similarity
        )

    assert result.compatibility_score == 75
    assert result.confidence == 85
    assert len(result.key_matches) == 3
    assert len(result.limitations) == 2
    assert "water" in result.relevance_explanation.lower()

    mock_create.assert_called_once()