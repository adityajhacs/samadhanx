from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routers import problems
from app.core.auth import get_current_user

from app.models.user import User
from app.routers import problems, auth
from app.models.university import University
from app.models.solution import Solution
from app.models.problem_ai_analysis import ProblemAIAnalysis

app = FastAPI(title="SamadhanX API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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