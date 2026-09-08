from app.services.ai.solution_recommendation import (
    explain_solution_recommendation
)


problem = """
Residents in rural villages are facing unreliable access
to clean drinking water.
"""

solution = """
Solar-powered smart water ATMs provide purified drinking
water using solar energy, water purification and digital
monitoring.
"""

similarity = 0.5946


result = explain_solution_recommendation(
    problem=problem,
    solution=solution,
    similarity=similarity
)

print("\nSolution Recommendation:")
print(result.model_dump())