import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


TASK_STATUSES = [
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED",
]


class ProjectTaskCreate(BaseModel):
    title: str = Field(min_length=1)
    description: str | None = None
    assigned_to: uuid.UUID | None = None
    status: str = "PENDING"


class ProjectTaskUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
    )
    description: str | None = None
    assigned_to: uuid.UUID | None = None
    status: str | None = None


class ProjectTaskResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    title: str
    description: str | None
    assigned_to: uuid.UUID | None
    status: str
    created_by: uuid.UUID | None
    created_at: datetime | None
    updated_at: datetime | None

    model_config = ConfigDict(
        from_attributes=True
    )