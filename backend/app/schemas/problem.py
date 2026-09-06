from uuid import UUID

from pydantic import BaseModel


class ProblemCreate(BaseModel):
    title: str
    description: str
    district: str
    category: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    image_url: str | None = None
    video_url: str | None = None


class ProblemResponse(BaseModel):
    id: UUID
    title: str
    description: str
    district: str
    category: str | None = None
    severity_score: int | None = None
    status: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    image_url: str | None = None
    video_url: str | None = None


class ProblemUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    district: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    image_url: str | None = None
    video_url: str | None = None