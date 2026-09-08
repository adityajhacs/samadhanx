from datetime import datetime
import uuid

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class IndustryPartnerCreate(BaseModel):
    name: str = Field(min_length=1)
    industry_type: str | None = None
    description: str | None = None
    location: str | None = None
    contact_email: EmailStr | None = None


class IndustryPartnerUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1)
    industry_type: str | None = None
    description: str | None = None
    location: str | None = None
    contact_email: EmailStr | None = None


class IndustryPartnerResponse(BaseModel):
    id: uuid.UUID
    name: str
    industry_type: str | None
    description: str | None
    location: str | None
    contact_email: str | None
    created_at: datetime | None

    model_config = ConfigDict(from_attributes=True)