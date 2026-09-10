from pydantic import BaseModel


class ProblemAIAnalysisResponse(BaseModel):
    id: str
    problem_id: str
    subcategory: str
    severity_level: str
    affected_sector: str
    estimated_affected_people: int
    root_cause: str
    ai_summary: str
    keywords: list[str]