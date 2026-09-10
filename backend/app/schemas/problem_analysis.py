import uuid
from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict


class ProblemAnalysisResponse(BaseModel):
    problem_id: uuid.UUID

    category: str | None = None
    severity_score: int | None = Field(default=None, ge=0, le=100)

    subcategory: str | None = None
    severity_level: str | None = None
    affected_sector: str | None = None
    estimated_affected_people: int | None = None
    root_cause: str | None = None
    ai_summary: str | None = None
    keywords: list[str] | None = None

    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)