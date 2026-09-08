from uuid import UUID

from app.core.database import SessionLocal
from app.services.ai.reality_check_service import run_reality_check


# IMPORTANT:
# Yahan apni database ki kisi existing solution ki ID daalna.
SOLUTION_ID = UUID("2b1c226d-dda2-4752-88f5-05a1e19effca")


solution = """
Install solar-powered smart water ATMs in villages
to provide reliable drinking water access.

The system will use solar energy, water purification,
and a digital monitoring system to track water usage
and maintenance requirements.
"""


db = SessionLocal()

try:
    result = run_reality_check(
        solution_id=SOLUTION_ID,
        solution=solution,
        db=db
    )

    print("\nRealityCheck saved successfully!\n")
    print(result)

finally:
    db.close()