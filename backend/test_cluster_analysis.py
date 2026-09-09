from unittest.mock import MagicMock, patch

from app.services.ai.cluster_analysis import (
    ClusterAnalysis,
    analyze_problem_cluster,
)


def test_analyze_problem_cluster():
    problems = [
        {
            "title": "Water shortage",
            "description": "Water supply is irregular.",
            "district": "Ghaziabad",
            "category": "Water",
            "severity_score": 8,
        },
        {
            "title": "Water pipeline issue",
            "description": "Pipeline is damaged.",
            "district": "Ghaziabad",
            "category": "Water",
            "severity_score": 7,
        },
    ]

    mock_response = MagicMock()
    mock_response.output_text = (
        '{"common_theme": "Water supply issues", '
        '"possible_root_cause": "Aging infrastructure"}'
    )

    with patch(
        "app.services.ai.cluster_analysis.client.interactions.create",
        return_value=mock_response,
    ):
        result = analyze_problem_cluster(problems)

    assert isinstance(result, ClusterAnalysis)
    assert result.common_theme == "Water supply issues"
    assert result.possible_root_cause == "Aging infrastructure"


def test_analyze_problem_cluster_rejects_empty_input():
    with patch(
        "app.services.ai.cluster_analysis.client.interactions.create"
    ) as mock_create:
        try:
            analyze_problem_cluster([])
            assert False
        except ValueError as exc:
            assert "cannot be empty" in str(exc)

        mock_create.assert_not_called()


def test_analyze_problem_cluster_rejects_non_list_input():
    with patch(
        "app.services.ai.cluster_analysis.client.interactions.create"
    ) as mock_create:
        try:
            analyze_problem_cluster(None)
            assert False
        except ValueError as exc:
            assert "must be a list" in str(exc)

        mock_create.assert_not_called()


def test_analyze_problem_cluster_rejects_oversized_input():
    problems = [
        {
            "title": "A" * 10001,
            "description": "",
            "district": "",
            "category": "",
            "severity_score": 1,
        }
    ]

    with patch(
        "app.services.ai.cluster_analysis.client.interactions.create"
    ) as mock_create:
        try:
            analyze_problem_cluster(problems)
            assert False
        except ValueError as exc:
            assert "too long" in str(exc)

        mock_create.assert_not_called()


def test_analyze_problem_cluster_rejects_empty_ai_response():
    problems = [
        {
            "title": "Water shortage",
            "description": "Water issue",
            "district": "Ghaziabad",
            "category": "Water",
            "severity_score": 8,
        }
    ]

    mock_response = MagicMock()
    mock_response.output_text = ""

    with patch(
        "app.services.ai.cluster_analysis.client.interactions.create",
        return_value=mock_response,
    ):
        try:
            analyze_problem_cluster(problems)
            assert False
        except ValueError as exc:
            assert "empty response" in str(exc)


def test_analyze_problem_cluster_handles_api_error():
    problems = [
        {
            "title": "Water shortage",
            "description": "Water issue",
            "district": "Ghaziabad",
            "category": "Water",
            "severity_score": 8,
        }
    ]

    with patch(
        "app.services.ai.cluster_analysis.client.interactions.create",
        side_effect=Exception("API error"),
    ):
        try:
            analyze_problem_cluster(problems)
            assert False
        except RuntimeError as exc:
            assert "temporarily unavailable" in str(exc)