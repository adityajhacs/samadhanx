from pydantic import BaseModel


class SolutionResponse(BaseModel):
    id: str
    problem_id: str
    university_id: str
    solution_title: str
    prototype_status: str
    estimated_cost: float
    funding_received: float