import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.problem import Problem
from app.models.problem_ai_analysis import ProblemAIAnalysis
from app.models.user import User
from app.schemas.problem_analysis import ProblemAnalysisResponse
from app.services.ai.analysis_service import analyze_and_save_problem


router = APIRouter(
    prefix="/api",
    tags=["Problem Analysis"],
)


@router.post(
    "/problems/{problem_id}/analyze",
    response_model=ProblemAnalysisResponse,
)
def analyze_problem_endpoint(
    problem_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    problem = (
        db.query(Problem)
        .filter(Problem.id == problem_id)
        .first()
    )

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    try:
        analysis = analyze_and_save_problem(
            problem_id=problem_id,
            db=db,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem analysis could not be generated",
        )

    return ProblemAnalysisResponse(
        problem_id=problem_id,
        category=problem.category,
        severity_score=problem.severity_score,
        subcategory=analysis.subcategory,
        severity_level=analysis.severity_level,
        affected_sector=analysis.affected_sector,
        estimated_affected_people=analysis.estimated_affected_people,
        root_cause=analysis.root_cause,
        ai_summary=analysis.ai_summary,
        keywords=analysis.keywords,
        created_at=analysis.created_at,
    )


@router.get(
    "/problems/{problem_id}/analysis",
    response_model=ProblemAnalysisResponse,
)
def get_problem_analysis(
    problem_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    problem = (
        db.query(Problem)
        .filter(Problem.id == problem_id)
        .first()
    )

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    analysis = (
        db.query(ProblemAIAnalysis)
        .filter(
            ProblemAIAnalysis.problem_id == problem_id
        )
        .first()
    )

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem analysis not found",
        )

    return ProblemAnalysisResponse(
        problem_id=problem_id,
        category=problem.category,
        severity_score=problem.severity_score,
        subcategory=analysis.subcategory,
        severity_level=analysis.severity_level,
        affected_sector=analysis.affected_sector,
        estimated_affected_people=analysis.estimated_affected_people,
        root_cause=analysis.root_cause,
        ai_summary=analysis.ai_summary,
        keywords=analysis.keywords,
        created_at=analysis.created_at,
    )