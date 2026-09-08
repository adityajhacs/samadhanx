from uuid import UUID

from app.core.database import SessionLocal
from app.services.ai.impact_measurement_service import (
    run_impact_measurement
)


SOLUTION_ID = UUID(
    "2b1c226d-dda2-4752-88f5-05a1e19effca"
)


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


db = SessionLocal()

try:
    result = run_impact_measurement(
        solution_id=SOLUTION_ID,
        metrics=metrics,
        db=db
    )

    print("\nImpact Measurement saved successfully!\n")
    print(result)

finally:
    db.close()