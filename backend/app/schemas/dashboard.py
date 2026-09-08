from pydantic import BaseModel


class DashboardOverviewResponse(BaseModel):
    total_projects: int
    active_projects: int
    total_industry_partners: int
    total_collaborations: int
    active_collaborations: int
    total_funding: float

class ProjectStatusResponse(BaseModel):
    IDEA: int
    VALIDATION: int
    TEAM_FORMATION: int
    SOLUTION_DESIGN: int
    PROTOTYPE: int
    FIELD_PILOT: int
    DEPLOYED: int
    IMPACT_MEASUREMENT: int

class CollaborationSummaryResponse(BaseModel):
    total_collaborations: int
    pending_collaborations: int
    approved_collaborations: int
    active_collaborations: int
    total_funding: float