from app.services.ai.resource_optimization import optimize_resources


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


result = optimize_resources(
    problem=problem,
    solutions=solutions
)

print("\nResource Optimization Result:")
print(result.model_dump())