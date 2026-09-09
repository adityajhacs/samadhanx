import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.auth import get_current_user, require_role
from app.models.user import User

from app.core.database import get_db
from app.models.problem import Problem
from app.models.problem_ai_analysis import ProblemAIAnalysis
from app.schemas.problem import ProblemCreate, ProblemUpdate, ProblemResponse
from app.services.ai.analysis import analyze_problem

router = APIRouter(
    prefix="/api/problems",
    tags=["Problems"]
)


@router.get("/", response_model=list[ProblemResponse])
def get_problems(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problems = db.query(Problem).all()
    return problems


@router.get("/{problem_id}", response_model=ProblemResponse)
def get_problem(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = db.query(Problem).filter(
        Problem.id == problem_id
    ).first()

    if not problem:
        return {"error": "Problem not found"}

    return problem


@router.post("/", response_model=ProblemResponse)
def create_problem(
    problem: ProblemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("citizen"))
):
    new_problem = Problem(
        citizen_id=current_user.id,
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
    problem = db.query(Problem).filter(
        Problem.id == problem_id
    ).first()

    if not problem:
        return {"error": "Problem not found"}

    update_data = problem_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(problem, field, value)

    db.commit()
    db.refresh(problem)

    return problem

@router.post("/{problem_id}/analyze")
def analyze_problem_endpoint(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    problem = db.query(Problem).filter(
        Problem.id == problem_id
    ).first()

    if not problem:
        return {"error": "Problem not found"}

    result = analyze_problem(problem.description)

    existing_analysis = db.query(ProblemAIAnalysis).filter(
        ProblemAIAnalysis.problem_id == problem.id
    ).first()

    if existing_analysis:
        existing_analysis.subcategory = result.subcategory
        existing_analysis.severity_level = result.severity_level
        existing_analysis.affected_sector = result.affected_sector
        existing_analysis.estimated_affected_people = result.estimated_affected_people
        existing_analysis.root_cause = result.root_cause
        existing_analysis.ai_summary = result.ai_summary
        existing_analysis.keywords = result.keywords
        existing_analysis.created_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(existing_analysis)

        return result

    analysis = ProblemAIAnalysis(
        id=uuid.uuid4(),
        problem_id=problem.id,
        subcategory=result.subcategory,
        severity_level=result.severity_level,
        affected_sector=result.affected_sector,
        estimated_affected_people=result.estimated_affected_people,
        root_cause=result.root_cause,
        ai_summary=result.ai_summary,
        keywords=result.keywords,
        created_at=datetime.now(timezone.utc),
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return result