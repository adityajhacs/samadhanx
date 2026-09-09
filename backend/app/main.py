from fastapi import FastAPI

from app.models.problem import Problem
from app.models.user import User
from app.routers.universities import (
    router as universities_router,
    problem_university_router,
)
from app.routers.solutions import (
    router as solutions_router,
    problem_solutions_router,
)
from app.routers.projects import router as projects_router
from app.routers.project_members import (
    router as project_members_router,
    project_members_router as project_members_project_router,
)
from app.routers.industry import router as industry_router
from app.routers import collaborations
from app.routers.collaborations import router as collaborations_router
from app.routers.dashboard import (
    router as dashboard_router,
    project_dashboard_router,
)

app = FastAPI(
    title="SamadhanX API",
    description="AI-powered civic problem solving platform",
    version="1.0.0"
)


app.include_router(universities_router)
app.include_router(problem_university_router)
app.include_router(solutions_router)
app.include_router(problem_solutions_router)
app.include_router(projects_router)
app.include_router(project_members_router)
app.include_router(project_members_project_router)
app.include_router(industry_router)
app.include_router(collaborations_router)
app.include_router(
    collaborations.project_collaborations_router
)
app.include_router(dashboard_router)
app.include_router(project_dashboard_router)
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "SamadhanX API"
    }