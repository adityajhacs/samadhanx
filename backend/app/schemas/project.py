import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


PROJECT_STATUSES = [
    "IDEA",
    "VALIDATION",
    "TEAM_FORMATION",
    "SOLUTION_DESIGN",
    "PROTOTYPE",
    "FIELD_PILOT",
    "DEPLOYED",
    "IMPACT_MEASUREMENT",
]


class ProjectCreate(BaseModel):
    problem_id: uuid.UUID | None = None
    solution_id: uuid.UUID | None = None
    title: str = Field(min_length=1)
    description: str | None = None
    status: str = "IDEA"
    deadline: datetime | None = None
    progress: int = Field(default=0, ge=0, le=100)
    budget: float | None = None
    expected_impact: int | None = None

class ProjectUpdate(BaseModel):
    problem_id: uuid.UUID | None = None
    solution_id: uuid.UUID | None = None
    title: str | None = Field(default=None, min_length=1)
    description: str | None = None
    status: str | None = None
    deadline: datetime | None = None
    progress: int | None = Field(default=None, ge=0, le=100)
    budget: float | None = None
    expected_impact: int | None = None

class ProjectResponse(BaseModel):
    id: uuid.UUID
    problem_id: uuid.UUID | None
    solution_id: uuid.UUID | None
    title: str
    description: str | None
    status: str | None
    created_by: uuid.UUID | None

    deadline: datetime | None
    progress: int
    budget: float | None
    expected_impact: int | None

    prototype_name: str | None
    prototype_url: str | None
    member_count: int = 0


    created_at: datetime | None
    updated_at: datetime | None

    model_config = ConfigDict(from_attributes=True)