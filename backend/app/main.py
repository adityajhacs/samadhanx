from fastapi import FastAPI

from app.models.problem import Problem
from app.routers.universities import router as universities_router
from app.routers.solutions import (
    router as solutions_router,
    problem_solutions_router,
)


app = FastAPI(
    title="SamadhanX API",
    description="AI-powered civic problem solving platform",
    version="1.0.0"
)


app.include_router(universities_router)
app.include_router(solutions_router)
app.include_router(problem_solutions_router)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "SamadhanX API"
    }