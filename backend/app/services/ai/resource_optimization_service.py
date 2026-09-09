from sqlalchemy import text
from sqlalchemy.orm import Session

from app.services.ai.resource_optimization import optimize_resources


def save_resource_optimization(
    db: Session,
    problem_id: str,
    problem: str,
    solutions: list[dict],
):
    """
    Run AI resource optimization and save the complete
    ranked result into the database.
    """

    # Prepare solutions text for Gemini
    solutions_text = "\n\n".join(
        [
            f"""
Solution {index + 1}:
Name: {solution["solution_name"]}
Estimated Cost: {solution.get("estimated_cost", "Unknown")}
Feasibility: {solution.get("feasibility", "Unknown")}
Expected Impact: {solution.get("expected_impact", "Unknown")}
Scalability: {solution.get("scalability", "Unknown")}
"""
            for index, solution in enumerate(solutions)
        ]
    )

    # Run AI optimization
    result = optimize_resources(
        problem=problem,
        solutions=solutions_text,
    )

    # Map solution name -> solution ID
    solution_map = {
        solution["solution_name"]: solution["solution_id"]
        for solution in solutions
    }

    # Save main optimization record
    optimization_query = text(
        """
        INSERT INTO resource_optimizations (
            problem_id,
            overall_recommendation
        )
        VALUES (
            :problem_id,
            :overall_recommendation
        )
        RETURNING id
        """
    )

    optimization_id = db.execute(
        optimization_query,
        {
            "problem_id": problem_id,
            "overall_recommendation": result.overall_recommendation,
        },
    ).scalar_one()

    # Save ranked solutions
    for ranked_solution in result.ranked_solutions:

        solution_id = solution_map.get(
            ranked_solution.solution_name
        )

        # Skip if AI returned an unknown solution name
        if not solution_id:
            continue

        item_query = text(
            """
            INSERT INTO resource_optimization_items (
                optimization_id,
                solution_id,
                priority_rank,
                priority_score,
                expected_impact,
                cost_efficiency,
                scalability,
                recommendation_reason,
                key_tradeoffs,
                confidence,
                uncertainty_notes
            )
            VALUES (
                :optimization_id,
                :solution_id,
                :priority_rank,
                :priority_score,
                :expected_impact,
                :cost_efficiency,
                :scalability,
                :recommendation_reason,
                :key_tradeoffs,
                :confidence,
                :uncertainty_notes
            )
            """
        )

        db.execute(
            item_query,
            {
                "optimization_id": optimization_id,
                "solution_id": solution_id,
                "priority_rank": ranked_solution.priority_rank,
                "priority_score": ranked_solution.priority_score,
                "expected_impact": ranked_solution.expected_impact,
                "cost_efficiency": ranked_solution.cost_efficiency,
                "scalability": ranked_solution.scalability,
                "recommendation_reason": ranked_solution.recommendation_reason,
                "key_tradeoffs": ranked_solution.key_tradeoffs,
                "confidence": ranked_solution.confidence,
                "uncertainty_notes": ranked_solution.uncertainty_notes,
            },
        )

    # Commit everything
    db.commit()

    return {
        "optimization_id": str(optimization_id),
        "overall_recommendation": result.overall_recommendation,
        "ranked_solutions": [
            item.model_dump()
            for item in result.ranked_solutions
        ],
    }