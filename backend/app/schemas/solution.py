import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class SolutionCreate(BaseModel):
    problem_id: uuid.UUID
    university_id: uuid.UUID
    solution_title: str = Field(min_length=1)
    prototype_status: str = "Idea"
    estimated_cost: Decimal | None = Field(default=None, ge=0)
    funding_received: Decimal = Field(default=0, ge=0)


class SolutionUpdate(BaseModel):
    problem_id: uuid.UUID | None = None
    university_id: uuid.UUID | None = None
    solution_title: str | None = Field(default=None, min_length=1)
    prototype_status: str | None = None
    estimated_cost: Decimal | None = Field(default=None, ge=0)
    funding_received: Decimal | None = Field(default=None, ge=0)


class SolutionResponse(BaseModel):
    id: uuid.UUID
    problem_id: uuid.UUID | None
    university_id: uuid.UUID | None
    solution_title: str
    prototype_status: str | None
    estimated_cost: Decimal | None
    funding_received: Decimal | None
    created_at: datetime | None

    model_config = ConfigDict(from_attributes=True)