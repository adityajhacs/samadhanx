from unittest.mock import MagicMock

from app.services.ai.university_matching import match_universities


def test_match_universities():
    db = MagicMock()

    row = MagicMock()
    row.id = "university-1"
    row.name = "RKGIT"
    row.expertise_areas = ["Water Management", "Civil Engineering"]
    row.district = "Ghaziabad"
    row.department = "Civil Engineering"
    row.similarity = 0.91

    db.execute.return_value = [row]

    result = match_universities(
        problem_id="problem-1",
        db=db,
        limit=5,
    )

    assert len(result) == 1
    assert result[0]["id"] == "university-1"
    assert result[0]["name"] == "RKGIT"
    assert result[0]["expertise_areas"] == [
        "Water Management",
        "Civil Engineering",
    ]
    assert result[0]["district"] == "Ghaziabad"
    assert result[0]["department"] == "Civil Engineering"
    assert result[0]["similarity"] == 0.91


def test_match_universities_returns_empty():
    db = MagicMock()

    db.execute.return_value = []

    result = match_universities(
        problem_id="problem-1",
        db=db,
        limit=5,
    )

    assert result == []


def test_match_universities_respects_limit():
    db = MagicMock()

    db.execute.return_value = []

    match_universities(
        problem_id="problem-1",
        db=db,
        limit=3,
    )

    db.execute.assert_called_once()

    params = db.execute.call_args.args[1]

    assert params["problem_id"] == "problem-1"
    assert params["limit"] == 3