from uuid import UUID
from pydantic import BaseModel
from app.services.ai.resource_optimization_service import (
    save_resource_optimization,
)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi import HTTPException
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
@router.post("/{solution_id}/impact-measurement")
def create_impact_measurement(
    solution_id: UUID,
    metrics: str,
    db: Session = Depends(get_db)
):
    # Check solution exists
    solution = db.execute(
        text("""
            SELECT id
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

    from app.services.ai.impact_measurement_service import (
        run_impact_measurement
    )

    result = run_impact_measurement(
        solution_id=solution_id,
        metrics=metrics,
        db=db
    )

    return result
@router.get("/{solution_id}/impact-measurement")
def get_impact_measurement(
    solution_id: UUID,
    db: Session = Depends(get_db)
):
    result = db.execute(
        text("""
            SELECT
                id,
                solution_id,
                raw_metrics,
                overall_impact,
                key_improvements,
                areas_of_concern,
                impact_score,
                interpretation,
                confidence,
                uncertainty_notes,
                created_at
            FROM public.impact_measurements
            WHERE solution_id = :solution_id
            ORDER BY created_at DESC
            LIMIT 1
        """),
        {
            "solution_id": str(solution_id)
        }
    ).mappings().first()

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Impact Measurement not found"
        )

    return dict(result)
class ResourceOptimizationSolution(BaseModel):
    solution_id: str
    solution_name: str
    estimated_cost: float | None = None
    feasibility: int | None = None
    expected_impact: str | None = None
    scalability: str | None = None


class ResourceOptimizationRequest(BaseModel):
    problem: str
    solutions: list[ResourceOptimizationSolution]


@router.post("/{solution_id}/resource-optimization")
def create_resource_optimization(
    solution_id: str,
    request: ResourceOptimizationRequest,
    db: Session = Depends(get_db),
):
    # Get the problem linked to the selected solution
    result = db.execute(
        text("""
            SELECT problem_id
            FROM solutions
            WHERE id = :solution_id
        """),
        {
            "solution_id": solution_id
        },
    ).first()

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Solution not found",
        )

    problem_id = result[0]

    # Convert Pydantic objects to dictionaries
    solutions = [
        solution.model_dump()
        for solution in request.solutions
    ]

    return save_resource_optimization(
        db=db,
        problem_id=str(problem_id),
        problem=request.problem,
        solutions=solutions,
    )


@router.get("/{solution_id}/resource-optimization")
def get_resource_optimization(
    solution_id: str,
    db: Session = Depends(get_db),
):
    result = db.execute(
        text("""
            SELECT problem_id
            FROM solutions
            WHERE id = :solution_id
        """),
        {
            "solution_id": solution_id
        },
    ).first()

    if not result:
        raise HTTPException(
            status_code=404,
            detail="Solution not found",
        )

    problem_id = result[0]

    optimization = db.execute(
        text("""
            SELECT
                id,
                problem_id,
                overall_recommendation,
                created_at
            FROM resource_optimizations
            WHERE problem_id = :problem_id
            ORDER BY created_at DESC
            LIMIT 1
        """),
        {
            "problem_id": problem_id
        },
    ).mappings().first()

    if not optimization:
        raise HTTPException(
            status_code=404,
            detail="Resource optimization not found",
        )

    items = db.execute(
        text("""
            SELECT
                roi.id,
                roi.solution_id,
                s.solution_title,
                roi.priority_rank,
                roi.priority_score,
                roi.expected_impact,
                roi.cost_efficiency,
                roi.scalability,
                roi.recommendation_reason,
                roi.key_tradeoffs,
                roi.confidence,
                roi.uncertainty_notes
            FROM resource_optimization_items roi
            JOIN solutions s
                ON s.id = roi.solution_id
            WHERE roi.optimization_id = :optimization_id
            ORDER BY roi.priority_rank ASC
        """),
        {
            "optimization_id": optimization["id"]
        },
    ).mappings().all()

    return {
        "optimization_id": str(optimization["id"]),
        "problem_id": str(optimization["problem_id"]),
        "overall_recommendation": optimization[
            "overall_recommendation"
        ],
        "created_at": optimization["created_at"],
        "ranked_solutions": [
            {
                **dict(item),
                "id": str(item["id"]),
                "solution_id": str(item["solution_id"]),
            }
            for item in items
        ],
    }