from unittest.mock import patch

from app.services.ai.impact_measurement import analyze_impact_metrics


def test_analyze_impact_metrics():
    metrics = """
    Before the solution, the village had an average of
    3 hours of reliable drinking water access per day.

    After implementation, reliable access increased to
    7 hours per day.

    Reported water availability complaints decreased from
    80 per month to 35 per month.

    The pilot covered 3 villages and approximately
    1200 residents.

    However, maintenance downtime increased during the
    monsoon period.
    """

    mock_output = """
    {
        "overall_impact": "Positive",
        "key_improvements": [
            "Reliable water access increased",
            "Water availability complaints decreased"
        ],
        "areas_of_concern": [
            "Maintenance downtime increased during monsoon"
        ],
        "impact_score": 75,
        "interpretation": "The solution significantly improved water access and reduced complaints, but maintenance issues remain a concern.",
        "confidence": 85,
        "uncertainty_notes": "The analysis is based on reported pilot metrics and may not capture all long-term effects."
    }
    """

    with patch(
        "app.services.ai.impact_measurement.client.interactions.create"
    ) as mock_create:
        mock_create.return_value.output_text = mock_output

        result = analyze_impact_metrics(metrics)

    assert result.overall_impact == "Positive"
    assert result.impact_score == 75
    assert result.confidence == 85
    assert len(result.key_improvements) == 2
    assert len(result.areas_of_concern) == 1
    assert "monsoon" in result.areas_of_concern[0].lower()

    mock_create.assert_called_once()