import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RealityCheckRiskResponse(BaseModel):
    id: uuid.UUID
    reality_check_id: uuid.UUID
    risk_category: str
    risk_description: str
    risk_level: str
    impact: str
    mitigation: str
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class RealityCheckResponse(BaseModel):
    id: uuid.UUID
    solution_id: uuid.UUID
    feasibility_score: int = Field(ge=0, le=100)
    overall_summary: str
    confidence: int = Field(ge=0, le=100)
    uncertainty_notes: str | None = None
    created_at: datetime | None = None
    risks: list[RealityCheckRiskResponse] = []

    model_config = ConfigDict(from_attributes=True)