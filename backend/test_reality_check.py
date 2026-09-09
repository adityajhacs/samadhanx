from unittest.mock import patch

from app.services.ai.reality_check import analyze_reality_check


def test_analyze_reality_check():
    solution = """
    Install solar-powered smart water ATMs in villages
    to provide reliable drinking water access.
    The system will use solar energy, water purification,
    and a digital monitoring system to track usage and maintenance.
    """

    mock_output = """
    {
        "feasibility_score": 75,
        "overall_summary": "The proposed solution is technically and operationally feasible with proper maintenance and user support.",
        "risks": [
            {
                "risk_category": "Technical",
                "risk_description": "Water purification and monitoring equipment may malfunction.",
                "risk_level": "Medium",
                "impact": "Could interrupt clean water availability.",
                "mitigation": "Schedule preventive maintenance and keep replacement components available."
            },
            {
                "risk_category": "Operational",
                "risk_description": "Maintenance may be delayed in remote villages.",
                "risk_level": "Medium",
                "impact": "Extended downtime could reduce reliability.",
                "mitigation": "Create a local maintenance support process."
            },
            {
                "risk_category": "Financial",
                "risk_description": "Initial installation and maintenance costs may be significant.",
                "risk_level": "Medium",
                "impact": "Budget constraints could limit deployment.",
                "mitigation": "Use phased deployment and identify funding sources."
            },
            {
                "risk_category": "Adoption",
                "risk_description": "Some users may have difficulty using digital payment systems.",
                "risk_level": "Low",
                "impact": "Some residents may not use the system.",
                "mitigation": "Provide simple payment options and user guidance."
            }
        ],
        "confidence": 85,
        "uncertainty_notes": "Long-term maintenance costs and user adoption may vary across villages."
    }
    """

    with patch(
        "app.services.ai.reality_check.client.interactions.create"
    ) as mock_create:
        mock_create.return_value.output_text = mock_output

        result = analyze_reality_check(solution)

    assert result.feasibility_score == 75
    assert result.confidence == 85
    assert len(result.risks) == 4

    assert result.risks[0].risk_category == "Technical"
    assert result.risks[1].risk_category == "Operational"
    assert result.risks[2].risk_category == "Financial"
    assert result.risks[3].risk_category == "Adoption"

    assert "maintenance" in result.uncertainty_notes.lower()

    mock_create.assert_called_once()