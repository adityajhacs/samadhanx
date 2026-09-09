from fastapi import FastAPI, Depends
from app.routers import problems
from app.core.auth import get_current_user

from app.models.user import User
from app.routers import problems, auth
from app.models.university import University
from app.models.solution import Solution
from app.models.problem_ai_analysis import ProblemAIAnalysis

app = FastAPI(title="SamadhanX API")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/auth-test")
def auth_test(current_user=Depends(get_current_user)):
    return {
        "message": "Authentication successful",
        "user": current_user
    }


app.include_router(problems.router)
app.include_router(auth.router)