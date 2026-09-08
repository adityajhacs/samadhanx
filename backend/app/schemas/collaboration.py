import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class CollaborationCreate(BaseModel):
    project_id: uuid.UUID
    industry_partner_id: uuid.UUID
    collaboration_type: str | None = None
    amount: Decimal | None = Field(default=None, ge=0)
    status: str = "PENDING"
    description: str | None = None


class CollaborationUpdate(BaseModel):
    collaboration_type: str | None = None
    amount: Decimal | None = Field(default=None, ge=0)
    status: str | None = None
    description: str | None = None


class CollaborationResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID | None
    industry_partner_id: uuid.UUID | None
    collaboration_type: str | None
    amount: Decimal | None
    status: str | None
    description: str | None
    created_at: datetime | None

    model_config = ConfigDict(from_attributes=True)