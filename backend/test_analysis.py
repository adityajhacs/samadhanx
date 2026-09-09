from unittest.mock import patch

from app.services.ai.analysis import analyze_problem


def test_analyze_problem():
    problem = """
    Our village has not received clean drinking water for the last 10 days.
    The main water pipeline is damaged and around 300 families are affected.
    People are forced to travel several kilometers to get drinking water.
    """

    mock_output = """
    {
        "category": "Water Supply",
        "subcategory": "Pipeline Damage",
        "severity_score": 85,
        "severity_level": "HIGH",
        "affected_sector": "Public Utilities",
        "estimated_affected_people": 300,
        "root_cause": "Damaged main water pipeline",
        "ai_summary": "A damaged pipeline has disrupted clean drinking water supply for around 300 families.",
        "keywords": [
            "water supply",
            "pipeline damage",
            "drinking water"
        ]
    }
    """

    with patch(
        "app.services.ai.analysis.client.interactions.create"
    ) as mock_create:

        mock_create.return_value.output_text = mock_output

        result = analyze_problem(problem)

    assert result.category == "Water Supply"
    assert result.subcategory == "Pipeline Damage"
    assert result.severity_score == 85
    assert result.severity_level == "HIGH"
    assert result.estimated_affected_people == 300
    assert result.root_cause == "Damaged main water pipeline"
    assert "water supply" in result.keywords

    mock_create.assert_called_once()