from fastapi import FastAPI
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


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "SamadhanX API"
    }