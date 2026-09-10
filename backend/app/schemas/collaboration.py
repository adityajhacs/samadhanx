import uuid
from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


COLLABORATION_TYPES = [
    "FUNDING",
    "MENTORSHIP",
    "HARDWARE",
    "TESTING",
    "PROTOTYPING",
]


COLLABORATION_STATUSES = [
    "REQUESTED",
    "UNDER_REVIEW",
    "ACCEPTED",
    "REJECTED",
    "COMPLETED",
]


class CollaborationCreate(BaseModel):
    project_id: uuid.UUID
    industry_partner_id: uuid.UUID

    collaboration_type: Literal[
        "FUNDING",
        "MENTORSHIP",
        "HARDWARE",
        "TESTING",
        "PROTOTYPING",
    ]

    amount: Decimal | None = Field(
        default=None,
        ge=0
    )

    status: Literal[
        "REQUESTED",
        "UNDER_REVIEW",
        "ACCEPTED",
        "REJECTED",
        "COMPLETED",
    ] = "REQUESTED"

    description: str | None = None


class CollaborationUpdate(BaseModel):
    collaboration_type: Literal[
        "FUNDING",
        "MENTORSHIP",
        "HARDWARE",
        "TESTING",
        "PROTOTYPING",
    ] | None = None

    amount: Decimal | None = Field(
        default=None,
        ge=0
    )

    status: Literal[
        "REQUESTED",
        "UNDER_REVIEW",
        "ACCEPTED",
        "REJECTED",
        "COMPLETED",
    ] | None = None

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

    model_config = ConfigDict(
        from_attributes=True
    )