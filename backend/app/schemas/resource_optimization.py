from pydantic import BaseModel, Field


class ResourceOptimizationRequest(BaseModel):
    solutions: str = Field(min_length=1)


class ResourceOptimizationRecommendationResponse(BaseModel):
    solution_name: str
    priority_rank: int
    priority_score: int = Field(ge=0, le=100)
    expected_impact: str
    cost_efficiency: str
    scalability: str
    recommendation_reason: str
    key_tradeoffs: list[str]
    confidence: int = Field(ge=0, le=100)
    uncertainty_notes: str


class ResourceOptimizationResponse(BaseModel):
    problem_id: str
    overall_recommendation: str
    ranked_solutions: list[ResourceOptimizationRecommendationResponse]