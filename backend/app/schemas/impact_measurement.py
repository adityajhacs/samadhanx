import uuid
from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict


class ImpactMeasurementRequest(BaseModel):
    metrics: str = Field(min_length=1)


class ImpactMeasurementResponse(BaseModel):
    id: uuid.UUID
    solution_id: uuid.UUID
    raw_metrics: str

    overall_impact: str
    key_improvements: list[str]
    areas_of_concern: list[str]

    impact_score: int = Field(ge=0, le=100)

    interpretation: str

    confidence: int = Field(ge=0, le=100)

    uncertainty_notes: str

    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)