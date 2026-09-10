import uuid

from pydantic import BaseModel, Field


class SolutionMemoryItem(BaseModel):
    id: uuid.UUID
    solution_title: str
    prototype_status: str | None = None
    estimated_cost: float | None = None
    funding_received: float | None = None

    similarity: float = Field(
        ge=0,
        le=1,
    )

    recommendation: str


class SolutionMemoryResponse(BaseModel):
    problem_id: uuid.UUID
    count: int
    solutions: list[SolutionMemoryItem]