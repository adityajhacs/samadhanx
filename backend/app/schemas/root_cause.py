import uuid

from pydantic import BaseModel, Field


class RootCauseAnalysisResponse(BaseModel):
    problem_id: uuid.UUID

    symptom: str
    possible_causes: list[str]
    contributing_factors: list[str]

    confidence: int = Field(
        ge=0,
        le=100,
    )

    need_field_verification: bool