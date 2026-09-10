import uuid

from pydantic import BaseModel, Field


class SolutionRecommendationResponse(BaseModel):
    problem_id: uuid.UUID
    solution_id: uuid.UUID

    similarity: float = Field(ge=0, le=1)

    relevance_explanation: str

    compatibility_score: int = Field(
        ge=0,
        le=100
    )

    key_matches: list[str]

    limitations: list[str]

    confidence: int = Field(
        ge=0,
        le=100
    )