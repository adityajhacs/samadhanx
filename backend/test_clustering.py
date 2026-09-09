from unittest.mock import MagicMock, patch

from app.services.ai.clustering import (
    find_similar_problems,
    build_problem_clusters,
)


def test_find_similar_problems():
    db = MagicMock()

    row = MagicMock()
    row.id = "problem-2"
    row.title = "Road problem"
    row.description = "Road is damaged"
    row.district = "Ghaziabad"
    row.category = "Infrastructure"
    row.severity_score = 8
    row.similarity = 0.91

    db.execute.return_value = [row]

    result = find_similar_problems(
        problem_id="problem-1",
        db=db,
    )

    assert len(result) == 1
    assert result[0]["id"] == "problem-2"
    assert result[0]["similarity"] == 0.91
    assert result[0]["category"] == "Infrastructure"


def test_find_similar_problems_returns_empty():
    db = MagicMock()

    db.execute.return_value = []

    result = find_similar_problems(
        problem_id="problem-1",
        db=db,
    )

    assert result == []


def test_build_problem_clusters_returns_empty_without_embeddings():
    db = MagicMock()

    db.execute.return_value.fetchall.return_value = []

    result = build_problem_clusters(db)

    assert result == []


def test_build_problem_clusters_creates_cluster():
    db = MagicMock()

    problem_1 = MagicMock()
    problem_1.id = "problem-1"

    problem_2 = MagicMock()
    problem_2.id = "problem-2"

    db.execute.return_value.fetchall.return_value = [
        problem_1,
        problem_2,
    ]

    similar_result = [
        {
            "id": "problem-2",
            "title": "Similar problem",
            "description": "Similar description",
            "district": "Ghaziabad",
            "category": "Infrastructure",
            "severity_score": 7,
            "similarity": 0.90,
        }
    ]

    with patch(
        "app.services.ai.clustering.find_similar_problems",
        return_value=similar_result,
    ):
        result = build_problem_clusters(db)

    assert isinstance(result, list)
    assert len(result) == 1
    assert len(result[0]["problem_ids"]) >= 2
    assert result[0]["name"] == "Problem Cluster 1"