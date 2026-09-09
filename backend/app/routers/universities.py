from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from sqlalchemy import and_

from app.core.database import get_db
from app.models.university import University
from app.models.problem import Problem
from app.models.problem_ai_analysis import ProblemAIAnalysis
from app.models.university_problem_interest import UniversityProblemInterest
from app.schemas.university import (
    UniversityResponse,
    ProblemAcceptRequest,
    ProblemRejectRequest,
)
from app.services.ai.university_matching import match_universities


router = APIRouter(
    prefix="/api/universities",
    tags=["Universities"]
)


# ============================================================
# UNIVERSITY LISTING
# ============================================================

@router.get("", response_model=list[UniversityResponse])
def get_universities(
    expertise: str | None = Query(default=None),
    district: str | None = Query(default=None),
    department: str | None = Query(default=None),
    db: Session = Depends(get_db)
):
    query = db.query(University)

    if district:
        query = query.filter(
            University.district == district
        )

    if department:
        query = query.filter(
            University.department == department
        )

    if expertise:
        query = query.filter(
            University.expertise_area.any(expertise)
        )

    universities = query.all()

    return universities


# ============================================================
# M4 AI UNIVERSITY MATCHING
# ============================================================

problem_university_router = APIRouter(
    prefix="/api/problems",
    tags=["University Matching"]
)


@problem_university_router.get(
    "/{problem_id}/universities"
)
def get_matched_universities(
    problem_id: UUID,
    limit: int = Query(default=5, ge=1, le=20),
    db: Session = Depends(get_db),
):
    return match_universities(
        problem_id=problem_id,
        db=db,
        limit=limit,
    )


# ============================================================
# UNIVERSITY PROBLEM FEED
# ============================================================

@router.get("/{university_id}/problems")
def get_university_problems(
    university_id: UUID,
    db: Session = Depends(get_db),
):
    university = (
        db.query(University)
        .filter(University.id == university_id)
        .first()
    )

    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found",
        )

    # Get all problems
    problems = db.query(Problem).all()

    result = []

    for problem in problems:

        # Get AI analysis
        analysis = (
            db.query(ProblemAIAnalysis)
            .filter(
                ProblemAIAnalysis.problem_id == problem.id
            )
            .first()
        )

        # Get AI university matching result for this problem
        matched_universities = match_universities(
            problem_id=problem.id,
            db=db,
            limit=20,
        )

        # Find current university in matching results
        university_match = next(
            (
                item
                for item in matched_universities
                if str(item["id"]) == str(university_id)
            ),
            None,
        )

        # Only show problems for which this university is matched
        if not university_match:
            continue

        result.append({
            "id": problem.id,
            "title": problem.title,
            "district": problem.district,
            "category": problem.category,
            "severity_score": problem.severity_score,

            "match_score": university_match["similarity"],

            "match_reasons": [
                "Relevant university expertise",
                "AI similarity match",
                "Problem domain relevance",
            ],

            "status": problem.status,

            "ai_summary": (
                analysis.ai_summary
                if analysis
                else None
            ),
        })

    # Highest matching problems first
    result.sort(
        key=lambda x: x["match_score"] or 0,
        reverse=True,
    )

    return {
        "problems": result
    }


# ============================================================
# UNIVERSITY PROBLEM DETAIL
# ============================================================

@router.get("/{university_id}/problems/{problem_id}")
def get_university_problem_detail(
    university_id: UUID,
    problem_id: UUID,
    db: Session = Depends(get_db),
):
    university = (
        db.query(University)
        .filter(University.id == university_id)
        .first()
    )

    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found",
        )

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
            ProblemAIAnalysis.problem_id == problem.id
        )
        .first()
    )

    return {
        "id": problem.id,
        "title": problem.title,
        "description": problem.description,
        "district": problem.district,
        "category": problem.category,
        "severity_score": problem.severity_score,
        "status": problem.status,

        "ai_analysis": {
            "subcategory": (
                analysis.subcategory
                if analysis
                else None
            ),
            "severity_level": (
                analysis.severity_level
                if analysis
                else None
            ),
            "affected_sector": (
                analysis.affected_sector
                if analysis
                else None
            ),
            "estimated_affected_people": (
                analysis.estimated_affected_people
                if analysis
                else None
            ),
            "root_cause": (
                analysis.root_cause
                if analysis
                else None
            ),
            "ai_summary": (
                analysis.ai_summary
                if analysis
                else None
            ),
            "keywords": (
                analysis.keywords
                if analysis
                else []
            ),
        },
    }


# ============================================================
# UNIVERSITY ACCEPTS PROBLEM
# ============================================================

@router.post("/{university_id}/problems/{problem_id}/accept")
def accept_problem(
    university_id: UUID,
    problem_id: UUID,
    data: ProblemAcceptRequest,
    db: Session = Depends(get_db),
):
    university = (
        db.query(University)
        .filter(University.id == university_id)
        .first()
    )

    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found",
        )

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

    existing = (
        db.query(UniversityProblemInterest)
        .filter(
            and_(
                UniversityProblemInterest.university_id
                == university_id,
                UniversityProblemInterest.problem_id
                == problem_id,
            )
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="University has already responded to this problem",
        )

    interest = UniversityProblemInterest(
        university_id=university_id,
        problem_id=problem_id,
        status="ACCEPTED",
        message=data.message,
    )

    db.add(interest)
    db.commit()
    db.refresh(interest)

    return {
        "success": True,
        "status": "ACCEPTED",
    }


# ============================================================
# UNIVERSITY REJECTS PROBLEM
# ============================================================

@router.post("/{university_id}/problems/{problem_id}/reject")
def reject_problem(
    university_id: UUID,
    problem_id: UUID,
    data: ProblemRejectRequest,
    db: Session = Depends(get_db),
):
    university = (
        db.query(University)
        .filter(University.id == university_id)
        .first()
    )

    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found",
        )

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

    existing = (
        db.query(UniversityProblemInterest)
        .filter(
            and_(
                UniversityProblemInterest.university_id
                == university_id,
                UniversityProblemInterest.problem_id
                == problem_id,
            )
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="University has already responded to this problem",
        )

    interest = UniversityProblemInterest(
        university_id=university_id,
        problem_id=problem_id,
        status="REJECTED",
        reason=data.reason,
    )

    db.add(interest)
    db.commit()
    db.refresh(interest)

    return {
        "success": True,
        "status": "REJECTED",
    }