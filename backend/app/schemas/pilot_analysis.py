from pydantic import BaseModel, Field


class PilotAnalysisRequest(BaseModel):
    feedback: str = Field(min_length=1)


class PilotAnalysisResponse(BaseModel):
    solution_id: str
    sentiment: str
    themes: list[str]
    common_issues: list[str]
    pilot_insight: str
    confidence: int = Field(ge=0, le=100)
    uncertainty_notes: str