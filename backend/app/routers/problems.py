from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.problem import Problem
from app.schemas.problem import ProblemCreate, ProblemUpdate, ProblemResponse


router = APIRouter(
    prefix="/problems",
    tags=["Problems"]
)


@router.get("/", response_model=list[ProblemResponse])
def get_problems(db: Session = Depends(get_db)):
    problems = db.query(Problem).all()
    return problems

@router.get("/{problem_id}", response_model=ProblemResponse)
def get_problem(problem_id: str, db: Session = Depends(get_db)):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()

    if not problem:
        return {"error": "Problem not found"}

    return problem    

@router.post("/", response_model=ProblemResponse)
def create_problem(problem: ProblemCreate, db: Session = Depends(get_db)):
    new_problem = Problem(
    citizen_id=problem.citizen_id,
    title=problem.title,
    description=problem.description,
    district=problem.district,
    category=problem.category,
    status="Pending",
    latitude=problem.latitude,
    longitude=problem.longitude,
    image_url=problem.image_url,
    video_url=problem.video_url,
)

    db.add(new_problem)
    db.commit()
    db.refresh(new_problem)

    return new_problem

@router.put("/{problem_id}", response_model=ProblemResponse)
def update_problem(
    problem_id: str,
    problem_data: ProblemUpdate,
    db: Session = Depends(get_db)
):
    problem = db.query(Problem).filter(Problem.id == problem_id).first()

    if not problem:
        return {"error": "Problem not found"}

    update_data = problem_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(problem, field, value)

    db.commit()
    db.refresh(problem)

    return problem    