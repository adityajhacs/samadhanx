import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UniversityResponse(BaseModel):
    id: uuid.UUID
    name: str
    expertise_area: list[str] | None = None
    district: str | None = None
    department: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProblemAcceptRequest(BaseModel):
    message: str | None = None


class ProblemRejectRequest(BaseModel):
    reason: str