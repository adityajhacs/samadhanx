from unittest.mock import patch
from pytest import raises
from app.services.ai.pilot_analysis import analyze_pilot_feedback


def test_analyze_pilot_feedback():
    feedback = """
    The solar water ATM was easy to use and villagers appreciated
    having access to clean drinking water nearby.

    However, the machine stopped working twice because of filter
    maintenance issues. Some elderly users found the digital
    payment system difficult to understand.

    Most users said they would continue using the system if
    maintenance was faster and payment options were simpler.
    """

    mock_output = """
    {
        "sentiment": "Positive",
        "themes": [
            "Ease of use",
            "Clean water access",
            "Maintenance",
            "Digital payment usability"
        ],
        "common_issues": [
            "Filter maintenance failures",
            "Digital payment difficulty for elderly users"
        ],
        "pilot_insight": "Users value the solution and want to continue using it, but faster maintenance and simpler payment options are needed.",
        "confidence": 85,
        "uncertainty_notes": "Feedback represents pilot users and may not capture all user groups."
    }
    """

    with patch(
        "app.services.ai.pilot_analysis.client.interactions.create"
    ) as mock_create:
        mock_create.return_value.output_text = mock_output

        result = analyze_pilot_feedback(feedback)

    assert result.sentiment == "Positive"
    assert result.confidence == 85
    assert len(result.themes) == 4
    assert len(result.common_issues) == 2
    assert "maintenance" in result.pilot_insight.lower()

    mock_create.assert_called_once()
    from pytest import raises


def test_analyze_pilot_feedback_rejects_empty_input():
    with raises(ValueError, match="cannot be empty"):
        analyze_pilot_feedback("")


def test_analyze_pilot_feedback_rejects_non_string_input():
    with raises(ValueError, match="must be a string"):
        analyze_pilot_feedback(None)


def test_analyze_pilot_feedback_rejects_oversized_input():
    huge_feedback = "A" * 10001

    with raises(ValueError, match="too long"):
        analyze_pilot_feedback(huge_feedback)