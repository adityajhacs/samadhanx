from app.services.ai.analysis import analyze_problem


problem = """
Our village has not received clean drinking water for the last 10 days.
The main water pipeline is damaged and around 300 families are affected.
People are forced to travel several kilometers to get drinking water.
"""


result = analyze_problem(problem)

print("\n===== AI ANALYSIS =====\n")
print(result)
print("\n===== JSON =====\n")
print(result.model_dump_json(indent=2))