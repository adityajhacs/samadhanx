from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.services.ai.analysis_service import analyze_and_save_problem
from app.core.database import get_db
from app.models.problem import Problem
from app.schemas.ai import AIAnalysisResponse
from app.schemas.problem import (
    ProblemCreate,
    ProblemUpdate,
    ProblemResponse
)


router = APIRouter(
    prefix="/problems",
    tags=["Problems"]
)


@router.get("/", response_model=list[ProblemResponse])
def get_problems(db: Session = Depends(get_db)):
    problems = db.query(Problem).all()
    return problems


@router.get("/{problem_id}", response_model=ProblemResponse)
def get_problem(
    problem_id: str,
    db: Session = Depends(get_db)
):
    problem = (
        db.query(Problem)
        .filter(Problem.id == problem_id)
        .first()
    )

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )

    return problem


@router.post("/", response_model=ProblemResponse)
def create_problem(
    problem: ProblemCreate,
    db: Session = Depends(get_db)
):
    new_problem = Problem(
        citizen_id=problem.citizen_id,
        title=problem.title,
        description=problem.description,
        district=problem.district,
        category=problem.category,
        latitude=problem.latitude,
        longitude=problem.longitude,
        image_url=problem.image_url,
        video_url=problem.video_url,
    )

    db.add(new_problem)
    db.commit()
    db.refresh(new_problem)

    return new_problem


@router.put("/{problem_id}")
def update_problem(
    problem_id: str,
    problem_data: ProblemUpdate,
    db: Session = Depends(get_db)
):
    problem = (
        db.query(Problem)
        .filter(Problem.id == problem_id)
        .first()
    )
    if not problem:
     raise HTTPException(
        status_code=404,
        detail="Problem not found"
    )

    update_data = problem_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(problem, field, value)

    db.commit()
    db.refresh(problem)

    return problem


@router.post(
    "/{problem_id}/analyze",
    response_model=AIAnalysisResponse
)
def analyze_problem_with_ai(
    problem_id: UUID,
    db: Session = Depends(get_db)
):
    analysis = analyze_and_save_problem(
        problem_id=problem_id,
        db=db
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )

    return analysis