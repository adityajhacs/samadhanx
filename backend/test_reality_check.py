from app.services.ai.reality_check import analyze_reality_check


solution = """
Install solar-powered smart water ATMs in villages
to provide reliable drinking water access.
The system will use solar energy, water purification,
and a digital monitoring system to track usage and maintenance.
"""


result = analyze_reality_check(solution)

print("\nRealityCheck Result:")
print(result.model_dump())