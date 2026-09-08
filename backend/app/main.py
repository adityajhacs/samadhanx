from fastapi import FastAPI

from app.routers import solutions
from app.routers.problems import router as problems_router

app = FastAPI(
    title="SamadhanX API",
    description="AI-powered civic problem solving platform",
    version="1.0.0"
)

app.include_router(
    problems_router,
    prefix="/api"
)

app.include_router(
    solutions.router,
    prefix="/api/solutions",
    tags=["Solutions"]
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "SamadhanX API"
    }