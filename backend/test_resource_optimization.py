from unittest.mock import patch
from pytest import raises
from app.services.ai.resource_optimization import optimize_resources


def test_optimize_resources():
    problem = """
    A rural district has unreliable drinking water access.
    The problem affects approximately 5,000 residents.
    Problem severity is High.
    """

    solutions = """
    Solution 1:
    Solar Powered Smart Water ATM
    Estimated Cost: 150000
    Feasibility: 75/100
    Expected Impact: High
    Scalability: High

    Solution 2:
    Community Water Tank and Manual Distribution
    Estimated Cost: 80000
    Feasibility: 90/100
    Expected Impact: Medium
    Scalability: Medium

    Solution 3:
    New Underground Pipeline Network
    Estimated Cost: 800000
    Feasibility: 55/100
    Expected Impact: Very High
    Scalability: High
    """

    mock_output = """
    {
        "overall_recommendation": "Solar Powered Smart Water ATM provides the best balance of impact, feasibility, scalability and resource efficiency.",
        "ranked_solutions": [
            {
                "solution_name": "Solar Powered Smart Water ATM",
                "priority_rank": 1,
                "priority_score": 88,
                "expected_impact": "High",
                "cost_efficiency": "High",
                "scalability": "High",
                "recommendation_reason": "It provides strong impact with good feasibility and scalability at a moderate cost.",
                "key_tradeoffs": [
                    "Higher initial cost than a community water tank",
                    "Requires technical maintenance"
                ],
                "confidence": 85,
                "uncertainty_notes": "Long-term maintenance costs may vary across rural locations."
            },
            {
                "solution_name": "Community Water Tank and Manual Distribution",
                "priority_rank": 2,
                "priority_score": 75,
                "expected_impact": "Medium",
                "cost_efficiency": "High",
                "scalability": "Medium",
                "recommendation_reason": "It is affordable and highly feasible but provides lower long-term impact and scalability.",
                "key_tradeoffs": [
                    "Lower initial cost",
                    "Requires manual distribution"
                ],
                "confidence": 85,
                "uncertainty_notes": "Operational requirements may vary between communities."
            },
            {
                "solution_name": "New Underground Pipeline Network",
                "priority_rank": 3,
                "priority_score": 58,
                "expected_impact": "Very High",
                "cost_efficiency": "Low",
                "scalability": "High",
                "recommendation_reason": "It offers very high impact but has low feasibility and very high implementation cost.",
                "key_tradeoffs": [
                    "Very high implementation cost",
                    "Low feasibility"
                ],
                "confidence": 80,
                "uncertainty_notes": "Actual infrastructure costs may vary significantly."
            }
        ]
    }
    """

    with patch(
        "app.services.ai.resource_optimization.client.interactions.create"
    ) as mock_create:
        mock_create.return_value.output_text = mock_output

        result = optimize_resources(
            problem=problem,
            solutions=solutions
        )

    assert len(result.ranked_solutions) == 3
    assert result.ranked_solutions[0].solution_name == "Solar Powered Smart Water ATM"
    assert result.ranked_solutions[0].priority_rank == 1
    assert result.ranked_solutions[0].priority_score == 88
    assert result.ranked_solutions[1].priority_rank == 2
    assert result.ranked_solutions[2].priority_rank == 3
    assert result.ranked_solutions[0].confidence == 85
    assert "balance" in result.overall_recommendation.lower()

    mock_create.assert_called_once()


def test_optimize_resources_rejects_empty_problem():
    with raises(ValueError, match="Problem cannot be empty"):
        optimize_resources(
            problem="",
            solutions="Solution 1: Water Tank"
        )
        


def test_optimize_resources_rejects_non_string_problem():
    with raises(ValueError, match="Problem must be a string"):
        optimize_resources(
            problem=None,
            solutions="Solution 1: Water Tank"
        )


def test_optimize_resources_rejects_empty_solutions():
    with raises(ValueError, match="Solutions cannot be empty"):
        optimize_resources(
            problem="Unreliable drinking water access",
            solutions=""
        )


def test_optimize_resources_rejects_non_string_solutions():
    with raises(ValueError, match="Solutions must be a string"):
        optimize_resources(
            problem="Unreliable drinking water access",
            solutions=None
        )


def test_optimize_resources_rejects_oversized_problem():
    huge_problem = "A" * 10001

    with raises(ValueError, match="Problem is too long"):
        optimize_resources(
            problem=huge_problem,
            solutions="Solution 1: Water Tank"
        )


def test_optimize_resources_rejects_oversized_solutions():
    huge_solutions = "A" * 10001

    with raises(ValueError, match="Solutions are too long"):
        optimize_resources(
            problem="Unreliable drinking water access",
            solutions=huge_solutions
        )