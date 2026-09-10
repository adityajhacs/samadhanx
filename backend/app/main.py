from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.core.auth import get_current_user

# Models
from app.models.user import User
from app.models.university import University
from app.models.solution import Solution
from app.models.problem import Problem
from app.models.problem_ai_analysis import ProblemAIAnalysis
from app.models.university_problem_interest import UniversityProblemInterest

# Core routers
from app.routers import problems, auth

# University routers
from app.routers.universities import (
    router as universities_router,
    problem_university_router,
)

# Solution routers
from app.routers.solutions import (
    router as solutions_router,
    problem_solutions_router,
    project_solutions_router,
)

# Project routers
from app.routers.projects import router as projects_router

# Project member routers
from app.routers.project_members import (
    router as project_members_router,
    project_members_router as project_members_project_router,
)

# Industry & collaboration
from app.routers.industry import router as industry_router
from app.routers import collaborations
from app.routers.collaborations import router as collaborations_router

# Dashboard
from app.routers.dashboard import (
    router as dashboard_router,
    project_dashboard_router,
)

# AI / Intelligence routers
from app.routers.problem_analysis import (
    router as problem_analysis_router,
)
from app.routers.root_cause import (
    router as root_cause_router,
)
from app.routers.cluster_analysis import (
    router as cluster_analysis_router,
)
from app.routers.solution_recommendation import (
    router as solution_recommendation_router,
)
from app.routers.solution_memory import (
    router as solution_memory_router,
)
from app.routers.reality_check import (
    router as reality_check_router,
)
from app.routers.pilot_analysis import (
    router as pilot_analysis_router,
)
from app.routers.impact_measurement import (
    router as impact_measurement_router,
)
from app.routers.resource_optimization import (
    router as resource_optimization_router,
)


# --------------------------------------------------
# FastAPI Application
# --------------------------------------------------

app = FastAPI(
    title="SamadhanX API",
    description="AI-powered civic problem solving platform",
    version="1.0.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Authentication Test
# --------------------------------------------------

@app.get("/auth-test")
def auth_test(current_user=Depends(get_current_user)):
    return {
        "message": "Authentication successful",
        "user": current_user,
    }


# --------------------------------------------------
# Core APIs
# --------------------------------------------------

app.include_router(problems.router)
app.include_router(auth.router)


# --------------------------------------------------
# University APIs
# --------------------------------------------------

app.include_router(universities_router)
app.include_router(problem_university_router)


# --------------------------------------------------
# Solution APIs
# --------------------------------------------------

app.include_router(solutions_router)
app.include_router(problem_solutions_router)
app.include_router(project_solutions_router)


# --------------------------------------------------
# Project APIs
# --------------------------------------------------

app.include_router(projects_router)

app.include_router(project_members_router)
app.include_router(project_members_project_router)


# --------------------------------------------------
# Industry APIs
# --------------------------------------------------

app.include_router(industry_router)


# --------------------------------------------------
# Collaboration APIs
# --------------------------------------------------

app.include_router(collaborations_router)
app.include_router(
    collaborations.project_collaborations_router
)


# --------------------------------------------------
# Dashboard APIs
# --------------------------------------------------

app.include_router(dashboard_router)
app.include_router(project_dashboard_router)


# --------------------------------------------------
# AI / Intelligence APIs
# --------------------------------------------------

app.include_router(problem_analysis_router)
app.include_router(root_cause_router)
app.include_router(cluster_analysis_router)
app.include_router(solution_recommendation_router)
app.include_router(solution_memory_router)
app.include_router(reality_check_router)
app.include_router(pilot_analysis_router)
app.include_router(impact_measurement_router)
app.include_router(resource_optimization_router)


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "SamadhanX API",
    }