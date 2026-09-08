from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.ai.reality_check_service import run_reality_check


router = APIRouter()


@router.post("/{solution_id}/reality-check")
def create_reality_check(
    solution_id: UUID,
    db: Session = Depends(get_db)
):
    # Fetch solution
    solution = db.execute(
        text("""
            SELECT
                id,
                solution_title
            FROM public.solutions
            WHERE id = :solution_id
        """),
        {
            "solution_id": str(solution_id)
        }
    ).mappings().first()

    if not solution:
        raise HTTPException(
            status_code=404,
            detail="Solution not found"
        )

    # Run RealityCheck AI and save result
    result = run_reality_check(
        solution_id=solution_id,
        solution=solution["solution_title"],
        db=db
    )

    return result
@router.get("/{solution_id}/memory")
def get_solution_memory(
    solution_id: UUID,
    db: Session = Depends(get_db)
):
    # Get solution and associated problem
    solution = db.execute(
        text("""
            SELECT
                s.id,
                s.problem_id,
                s.solution_title,
                p.title AS problem_title,
                p.description AS problem_description,
                p.district,
                p.category
            FROM public.solutions s
            JOIN public.problems p
                ON p.id = s.problem_id
            WHERE s.id = :solution_id
        """),
        {
            "solution_id": str(solution_id)
        }
    ).mappings().first()

    if not solution:
        raise HTTPException(
            status_code=404,
            detail="Solution not found"
        )

    from app.services.ai.solution_memory import find_similar_solutions
    from app.services.ai.solution_recommendation import (
        explain_solution_recommendation
    )

    # Find similar past solutions
    recommendations = find_similar_solutions(
        problem_id=solution["problem_id"],
        db=db,
        limit=5
    )

    # Add AI explanation to each recommendation
    for recommendation in recommendations:

        problem_text = f"""
Title: {solution["problem_title"]}

Description: {solution["problem_description"]}

District: {solution["district"]}

Category: {solution["category"]}
"""

        explanation = explain_solution_recommendation(
            problem=problem_text,
            solution=recommendation["solution_title"],
            similarity=recommendation["similarity"]
        )

        recommendation["ai_explanation"] = (
            explanation.model_dump()
        )

    return {
        "solution_id": solution["id"],
        "problem_id": solution["problem_id"],
        "recommendations": recommendations
    }