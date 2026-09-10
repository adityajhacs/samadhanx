
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.models.problem import Problem
from app.models.problem_support import ProblemSupport
from app.models.problem_feedback import ProblemFeedback
from app.schemas.engagement import (
    SupportResponse,
    FeedbackCreate,
    FeedbackResponse,
)


router = APIRouter(
    prefix="/api",
    tags=["Engagement"],
)


@router.post(
    "/problems/{problem_id}/support",
    response_model=SupportResponse,
)
def support_problem(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    problem = db.query(Problem).filter(
        Problem.id == problem_id
    ).first()

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found",
        )

    existing_support = db.query(ProblemSupport).filter(
        ProblemSupport.problem_id == problem_id,
        ProblemSupport.user_id == current_user.id,
    ).first()

    if existing_support:
        count = db.query(ProblemSupport).filter(
            ProblemSupport.problem_id == problem_id
        ).count()

        return {
            "supported": True,
            "supporters": count,
            "message": "You already support this problem.",
        }

    support = ProblemSupport(
        problem_id=problem_id,
        user_id=current_user.id,
    )

    db.add(support)
    db.commit()

    count = db.query(ProblemSupport).filter(
        ProblemSupport.problem_id == problem_id
    ).count()

    return {
        "supported": True,
        "supporters": count,
        "message": "Problem supported successfully.",
    }


@router.get("/problems/{problem_id}/support")
def get_problem_support(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    count = db.query(ProblemSupport).filter(
        ProblemSupport.problem_id == problem_id
    ).count()

    existing_support = db.query(ProblemSupport).filter(
        ProblemSupport.problem_id == problem_id,
        ProblemSupport.user_id == current_user.id,
    ).first()

    return {
        "supported": existing_support is not None,
        "supporters": count,
    }


@router.post(
    "/problems/{problem_id}/feedback",
    response_model=FeedbackResponse,
)
def submit_feedback(
    problem_id: str,
    data: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    problem = db.query(Problem).filter(
        Problem.id == problem_id
    ).first()

    if not problem:
        raise HTTPException(
            status_code=404,
            detail="Problem not found",
        )

    if not data.feedback.strip():
        raise HTTPException(
            status_code=400,
            detail="Feedback cannot be empty.",
        )

    new_feedback = ProblemFeedback(
        problem_id=problem_id,
        user_id=current_user.id,
        feedback=data.feedback.strip(),
    )

    db.add(new_feedback)
    db.commit()

    return {
        "message": "Feedback submitted successfully.",
    }

