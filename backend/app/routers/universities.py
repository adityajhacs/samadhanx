from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from sqlalchemy import and_

from app.core.database import get_db
from app.models.university import University
from app.models.problem import Problem
from app.models.problem_ai_analysis import ProblemAIAnalysis
from app.core.auth import get_current_user
from app.models.user import User
from app.models.university_problem_interest import UniversityProblemInterest
from app.schemas.university import (
    UniversityResponse,
    ProblemAcceptRequest,
    ProblemRejectRequest,
)
from app.services.ai.university_matching import match_universities


router = APIRouter(
    prefix="/api/universities",
    tags=["Universities"],
)


# ============================================================
# HELPERS
# ============================================================

def get_role(user: User) -> str:
    return (user.role or "").strip().lower()


def require_university_portal_access(
    current_user: User,
):
    """
    University, Faculty and Student can access
    University Portal problem content.

    IMPORTANT:
    This is VIEW access.

    All three roles can view problems belonging to
    any university. They are not restricted to their
    own university for viewing.
    """

    role = get_role(current_user)

    if role not in {
        "university",
        "faculty",
        "student",
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only university, faculty, and student users "
                "can access university problems"
            ),
        )


def require_problem_decision_access(
    current_user: User,
):
    """
    Only University and Faculty can accept/reject problems.

    Students can only view problems.
    """

    role = get_role(current_user)

    if role not in {
        "university",
        "faculty",
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only university and faculty users "
                "can accept or reject problems"
            ),
        )

    if not current_user.university_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="University is not linked to this user",
        )


# ============================================================
# UNIVERSITY LISTING
# ============================================================

@router.get(
    "",
    response_model=list[UniversityResponse],
)
def get_universities(
    expertise: str | None = Query(default=None),
    district: str | None = Query(default=None),
    department: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    """
    Public university listing.

    Used during Student/Faculty registration so they can
    select an existing university.
    """

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
    tags=["University Matching"],
)


@problem_university_router.get(
    "/{problem_id}/universities"
)
def get_matched_universities(
    problem_id: UUID,
    limit: int = Query(
        default=5,
        ge=1,
        le=20,
    ),
    db: Session = Depends(get_db),
):
    """
    M4 AI university matching.

    Returns universities matched with the problem
    based on AI similarity.
    """

    return match_universities(
        problem_id=problem_id,
        db=db,
        limit=limit,
    )


# ============================================================
# UNIVERSITY PROBLEM FEED
# ============================================================

@router.get(
    "/{university_id}/problems"
)
def get_university_problems(
    university_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    University / Faculty / Student can VIEW problems
    from any university.

    IMPORTANT:
    university_id is used to calculate the requested
    university's AI matching and university-specific
    interest status.

    It is NOT used to restrict the viewer to their own
    university.

    Therefore:

        University A -> can view University B problems
        Faculty A    -> can view University B problems
        Student A    -> can view University B problems

    Viewing is read-only.

    Accept/Reject permissions are handled separately.
    """

    require_university_portal_access(current_user)

    # --------------------------------------------------------
    # Requested university must exist
    # --------------------------------------------------------

    university = (
        db.query(University)
        .filter(
            University.id == university_id
        )
        .first()
    )

    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found",
        )

    # --------------------------------------------------------
    # Get all problems
    #
    # Do NOT filter by current_user.university_id.
    # Everyone in the University Portal can view all problems.
    # --------------------------------------------------------

    problems = (
        db.query(Problem)
        .all()
    )

    result = []

    for problem in problems:

        # ----------------------------------------------------
        # AI analysis
        # ----------------------------------------------------

        analysis = (
            db.query(ProblemAIAnalysis)
            .filter(
                ProblemAIAnalysis.problem_id
                == problem.id
            )
            .first()
        )

        # ----------------------------------------------------
        # AI university matching
        # ----------------------------------------------------

        matched_universities = match_universities(
            problem_id=problem.id,
            db=db,
            limit=20,
        )

        university_match = next(
            (
                item
                for item in matched_universities
                if str(item["id"])
                == str(university_id)
            ),
            None,
        )

        # ----------------------------------------------------
        # University-specific interest
        # ----------------------------------------------------

        interest = (
            db.query(UniversityProblemInterest)
            .filter(
                and_(
                    UniversityProblemInterest.university_id
                    == university_id,
                    UniversityProblemInterest.problem_id
                    == problem.id,
                )
            )
            .first()
        )

        result.append({
            "id": problem.id,
            "title": problem.title,
            "description": problem.description,
            "district": problem.district,
            "category": problem.category,
            "severity_score": problem.severity_score,

            # ------------------------------------------------
            # Citizen uploaded evidence
            # ------------------------------------------------
            "image_url": problem.image_url,
            "video_url": problem.video_url,

            "match_score": (
                university_match["similarity"]
                if university_match
                else None
            ),

            "match_reasons": [
                "Relevant university expertise",
                "AI similarity match",
                "Problem domain relevance",
            ],

            "status": (
                interest.status
                if interest
                else problem.status
            ),

            "ai_summary": (
                analysis.ai_summary
                if analysis
                else None
            ),
        })

    # --------------------------------------------------------
    # Matched problems first.
    # Problems without a match are still visible.
    # --------------------------------------------------------

    result.sort(
        key=lambda x: (
            x["match_score"] is not None,
            x["match_score"] or 0,
        ),
        reverse=True,
    )

    return {
        "problems": result
    }


# ============================================================
# UNIVERSITY PROBLEM DETAIL
# ============================================================

@router.get(
    "/{university_id}/problems/{problem_id}"
)
def get_university_problem_detail(
    university_id: UUID,
    problem_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    University / Faculty / Student can VIEW any problem.

    The viewer does NOT need to belong to the university
    represented by university_id.

    This endpoint is read-only.
    """

    require_university_portal_access(current_user)

    # --------------------------------------------------------
    # Requested university must exist
    # --------------------------------------------------------

    university = (
        db.query(University)
        .filter(
            University.id == university_id
        )
        .first()
    )

    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found",
        )

    # --------------------------------------------------------
    # Problem
    # --------------------------------------------------------

    problem = (
        db.query(Problem)
        .filter(
            Problem.id == problem_id
        )
        .first()
    )

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    # --------------------------------------------------------
    # AI analysis
    # --------------------------------------------------------

    analysis = (
        db.query(ProblemAIAnalysis)
        .filter(
            ProblemAIAnalysis.problem_id
            == problem.id
        )
        .first()
    )

    # --------------------------------------------------------
    # UNIVERSITY MATCH
    # --------------------------------------------------------

    matched_universities = match_universities(
        problem_id=problem.id,
        db=db,
        limit=20,
    )

    university_match = next(
        (
            item
            for item in matched_universities
            if str(item["id"])
            == str(university_id)
        ),
        None,
    )

    # --------------------------------------------------------
    # UNIVERSITY-SPECIFIC STATUS
    # --------------------------------------------------------

    interest = (
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

    # --------------------------------------------------------
    # SIMILAR PROBLEMS
    # --------------------------------------------------------

    similar_query = (
        db.query(Problem)
        .filter(
            Problem.id != problem_id
        )
    )

    if problem.category:
        similar_query = similar_query.filter(
            Problem.category
            == problem.category
        )

    similar_problems = (
        similar_query
        .limit(2)
        .all()
    )

    if len(similar_problems) < 2:

        existing_ids = [
            item.id
            for item in similar_problems
        ]

        existing_ids.append(problem_id)

        fallback_problems = (
            db.query(Problem)
            .filter(
                ~Problem.id.in_(existing_ids)
            )
            .limit(
                2 - len(similar_problems)
            )
            .all()
        )

        similar_problems.extend(
            fallback_problems
        )

    similar_problem_data = []

    for similar_problem in similar_problems:
        similar_problem_data.append({
            "id": similar_problem.id,
            "title": similar_problem.title,
            "category": similar_problem.category,
            "district": similar_problem.district,
        })

    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {
        "id": problem.id,
        "title": problem.title,
        "description": problem.description,
        "district": problem.district,
        "category": problem.category,
        "severity_score": problem.severity_score,

        # ----------------------------------------------------
        # Citizen uploaded evidence
        # ----------------------------------------------------
        "image_url": problem.image_url,
        "video_url": problem.video_url,

        "status": (
            interest.status
            if interest
            else problem.status
        ),

        "match_score": (
            university_match["similarity"]
            if university_match
            else None
        ),

        "match_reasons": [
            "Relevant university expertise",
            "AI similarity match",
            "Problem domain relevance",
        ],

        "university_expertise": (
            university.expertise_area
            or []
        ),

        "similar_problems": similar_problem_data,

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
# UNIVERSITY / FACULTY ACCEPTS PROBLEM
# ============================================================

@router.post(
    "/{university_id}/problems/{problem_id}/accept"
)
def accept_problem(
    university_id: UUID,
    problem_id: UUID,
    data: ProblemAcceptRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    University and Faculty can accept a problem
    for their OWN university.

    Student is not allowed to accept problems.

    Viewing another university's problems is allowed,
    but accepting/rejecting on behalf of another university
    is not allowed.
    """

    require_problem_decision_access(
        current_user
    )

    # --------------------------------------------------------
    # Decision must be for current user's university
    # --------------------------------------------------------

    if current_user.university_id != university_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You cannot accept problems "
                "for another university"
            ),
        )

    # --------------------------------------------------------
    # University
    # --------------------------------------------------------

    university = (
        db.query(University)
        .filter(
            University.id == university_id
        )
        .first()
    )

    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found",
        )

    # --------------------------------------------------------
    # Problem
    # --------------------------------------------------------

    problem = (
        db.query(Problem)
        .filter(
            Problem.id == problem_id
        )
        .first()
    )

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    # --------------------------------------------------------
    # Existing interest
    # --------------------------------------------------------

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
        existing.status = "ACCEPTED"
        existing.message = data.message

        db.commit()
        db.refresh(existing)

        return {
            "success": True,
            "status": "ACCEPTED",
        }

    # --------------------------------------------------------
    # Create interest
    # --------------------------------------------------------

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
# UNIVERSITY / FACULTY REJECTS PROBLEM
# ============================================================

@router.post(
    "/{university_id}/problems/{problem_id}/reject"
)
def reject_problem(
    university_id: UUID,
    problem_id: UUID,
    data: ProblemRejectRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    University and Faculty can reject a problem
    for their OWN university.

    Student is not allowed to reject problems.

    Viewing another university's problems is allowed,
    but rejecting on behalf of another university
    is not allowed.
    """

    require_problem_decision_access(
        current_user
    )

    # --------------------------------------------------------
    # Decision must be for current user's university
    # --------------------------------------------------------

    if current_user.university_id != university_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You cannot reject problems "
                "for another university"
            ),
        )

    # --------------------------------------------------------
    # University
    # --------------------------------------------------------

    university = (
        db.query(University)
        .filter(
            University.id == university_id
        )
        .first()
    )

    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found",
        )

    # --------------------------------------------------------
    # Problem
    # --------------------------------------------------------

    problem = (
        db.query(Problem)
        .filter(
            Problem.id == problem_id
        )
        .first()
    )

    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found",
        )

    # --------------------------------------------------------
    # Existing interest
    # --------------------------------------------------------

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
        existing.status = "REJECTED"
        existing.reason = data.reason

        db.commit()
        db.refresh(existing)

        return {
            "success": True,
            "status": "REJECTED",
        }

    # --------------------------------------------------------
    # Create interest
    # --------------------------------------------------------

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