import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ProjectMemberCreate(BaseModel):
    project_id: uuid.UUID
    user_id: uuid.UUID
    role: str | None = None


class ProjectMemberUpdate(BaseModel):
    role: str | None = None


class ProjectMemberResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    user_id: uuid.UUID
    role: str | None
    joined_at: datetime | None

    model_config = ConfigDict(from_attributes=True)