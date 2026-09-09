from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from sqlalchemy import text
from app.services.ai.analysis_service import analyze_and_save_problem
from app.services.ai.root_cause_service import analyze_and_save_root_cause
from app.core.database import get_db
from app.models.problem import Problem
from app.services.ai.university_matching import match_universities
from app.schemas.ai import AIAnalysisResponse
from app.services.ai.embedding import generate_embedding
from app.schemas.problem import (
    ProblemCreate,
    ProblemUpdate,
    ProblemResponse
)


router = APIRouter(
    prefix="/problems",
    tags=["Problems"]
)

@router.post("/{problem_id}/root-cause")
def analyze_problem_root_cause(
    problem_id: UUID,
    db: Session = Depends(get_db)
):
    analysis = analyze_and_save_root_cause(
        problem_id=problem_id,
        db=db
    )

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Problem not found"
        )

    return analysis
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
    problem_text = f"""
Title: {problem.title}

Description: {problem.description}

District: {problem.district}
"""
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
        embedding=generate_embedding(problem_text)
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
    try:
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

    except HTTPException:
        raise

    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc)
        ) from exc

    except RuntimeError:
        raise HTTPException(
            status_code=503,
            detail="AI analysis service is temporarily unavailable."
        )

@router.get("/{problem_id}/similar")
def get_similar_problems(
    problem_id: UUID,
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

  if problem.embedding is None:
        raise HTTPException(
            status_code=400,
            detail="Problem embedding not found"
        )
  query = text("""
        SELECT
            p.id,
            p.title,
            p.description,
            p.district,
            p.category,
            ROUND(
                (1 - (p.embedding <=> target.embedding))::numeric,
                4
            ) AS similarity
        FROM public.problems p
        CROSS JOIN (
            SELECT embedding
            FROM public.problems
            WHERE id = :problem_id
        ) target
       WHERE p.embedding IS NOT NULL
  AND p.id != :problem_id
  AND (1 - (p.embedding <=> target.embedding)) >= 0.85
        ORDER BY p.embedding <=> target.embedding
        LIMIT 5
    """)

  result = db.execute(
        query,
        {"problem_id": str(problem_id)}
    )

  return [
        {
            "id": row.id,
            "title": row.title,
            "description": row.description,
            "district": row.district,
            "category": row.category,
            "similarity": float(row.similarity)
        }
        for row in result
    ]
@router.get("/{problem_id}/universities")
def get_matching_universities(
    problem_id: UUID,
    db: Session = Depends(get_db)
):
    matches = match_universities(
        problem_id=problem_id,
        db=db
    )

    if not matches:
        raise HTTPException(
            status_code=404,
            detail="No matching universities found"
        )

    return {
        "problem_id": problem_id,
        "universities": matches
    }