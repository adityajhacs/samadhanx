from app.services.ai.impact_measurement import analyze_impact_metrics


metrics = """
Before the solution, the village had an average of
3 hours of reliable drinking water access per day.

After implementation, reliable access increased to
7 hours per day.

Reported water availability complaints decreased from
80 per month to 35 per month.

The pilot covered 3 villages and approximately
1200 residents.

However, maintenance downtime increased during the
monsoon period.
"""


result = analyze_impact_metrics(metrics)

print("\nImpact Measurement Result:")
print(result.model_dump())