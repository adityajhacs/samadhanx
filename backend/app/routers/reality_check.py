
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.solution import Solution
from app.models.problem import Problem
from app.models.university import University
from app.models.project import Project
from app.models.user import User
from app.schemas.reality_check import RealityCheckResponse
from app.services.ai.reality_check_service import run_reality_check


router = APIRouter(
    prefix="/api",
    tags=["RealityCheck"],
)


def get_role(current_user: User) -> str:
    return (current_user.role or "").strip().lower()


def can_run_reality_check(
    current_user: User,
    solution: Solution,
    project_owner_id: uuid.UUID | None = None,
) -> bool:
    # Any authenticated user can run RealityCheck.
    return current_user is not None

def get_reality_check_result(
    db: Session,
    solution_id: uuid.UUID,
):
    result = db.execute(
        text(
            """
            SELECT
                id,
                solution_id,
                feasibility_score,
                overall_summary,
                confidence,
                uncertainty_notes,
                created_at
            FROM public.reality_checks
            WHERE solution_id = :solution_id
            ORDER BY created_at DESC
            LIMIT 1
            """
        ),
        {
            "solution_id": str(solution_id)
        },
    ).mappings().first()

    if not result:
        return None

    risks = db.execute(
        text(
            """
            SELECT
                id,
                reality_check_id,
                risk_category,
                risk_description,
                risk_level,
                impact,
                mitigation,
                created_at
            FROM public.solution_risks
            WHERE reality_check_id = :reality_check_id
            ORDER BY created_at
            """
        ),
        {
            "reality_check_id": str(result["id"])
        },
    ).mappings().all()

    return {
        "id": result["id"],
        "solution_id": result["solution_id"],
        "feasibility_score": result["feasibility_score"],
        "overall_summary": result["overall_summary"],
        "confidence": result["confidence"],
        "uncertainty_notes": result["uncertainty_notes"],
        "created_at": result["created_at"],
        "risks": [
            {
                "id": risk["id"],
                "reality_check_id": risk["reality_check_id"],
                "risk_category": risk["risk_category"],
                "risk_description": risk["risk_description"],
                "risk_level": risk["risk_level"],
                "impact": risk["impact"],
                "mitigation": risk["mitigation"],
                "created_at": risk["created_at"],
            }
            for risk in risks
        ],
    }


@router.post(
    "/solutions/{solution_id}/reality-check",
    response_model=RealityCheckResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_reality_check(
    solution_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    solution = (
        db.query(Solution)
        .filter(Solution.id == solution_id)
        .first()
    )

    if not solution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solution not found",
        )

    # --------------------------------------------------------
    # Resolve project owner
    # --------------------------------------------------------

    project_owner_id = None

    if solution.project_id:
        project_owner_id = db.execute(
            text(
                """
                SELECT created_by
                FROM public.projects
                WHERE id = :project_id
                """
            ),
            {
                "project_id": str(solution.project_id)
            },
        ).scalar_one_or_none()

    # --------------------------------------------------------
    # Authorization
    # --------------------------------------------------------

    if not can_run_reality_check(
        current_user=current_user,
        solution=solution,
        project_owner_id=project_owner_id,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to run RealityCheck",
        )

    # --------------------------------------------------------
    # Get related information
    # --------------------------------------------------------

    problem = None

    if solution.problem_id:
        problem = (
            db.query(Problem)
            .filter(
                Problem.id == solution.problem_id
            )
            .first()
        )

    university = None

    if solution.university_id:
        university = (
            db.query(University)
            .filter(
                University.id == solution.university_id
            )
            .first()
        )

    project = None

    if solution.project_id:
        project = (
            db.query(Project)
            .filter(
                Project.id == solution.project_id
            )
            .first()
        )

    # --------------------------------------------------------
    # Build complete AI input
    # --------------------------------------------------------

    solution_parts = [
        f"Solution Title: {solution.solution_title}",
        f"Solution Description: {solution.description or 'Not provided'}",
        (
            "Prototype Status: "
            f"{solution.prototype_status or 'Not provided'}"
        ),
        (
            "Estimated Cost: "
            f"{solution.estimated_cost if solution.estimated_cost is not None else 'Not provided'}"
        ),
        (
            "What the Prototype Does: "
            f"{solution.prototype_description or 'Not provided'}"
        ),
        (
            "How It Works: "
            f"{solution.how_it_works or 'Not provided'}"
        ),
        (
            "Key Features: "
            f"{solution.key_features or 'Not provided'}"
        ),
        (
            "How This Solution Solves the Problem: "
            f"{solution.problem_solution or 'Not provided'}"
        ),
    ]

    if problem:
        solution_parts.extend(
            [
                f"Related Problem Title: {problem.title}",
                (
                    "Related Problem Description: "
                    f"{problem.description or 'Not provided'}"
                ),
                (
                    "Problem District: "
                    f"{problem.district or 'Not provided'}"
                ),
                (
                    "Problem Category: "
                    f"{problem.category or 'Not provided'}"
                ),
            ]
        )

    if university:
        solution_parts.append(
            f"University: {university.name}"
        )

    if project:
        solution_parts.append(
            f"Project: {getattr(project, 'title', None) or 'Not provided'}"
        )

    solution_text = "\n\n".join(solution_parts)

    try:
        return run_reality_check(
            solution_id=solution_id,
            solution=solution_text,
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


@router.get(
    "/solutions/{solution_id}/reality-check",
    response_model=RealityCheckResponse,
)
def get_solution_reality_check(
    solution_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    solution = (
        db.query(Solution)
        .filter(Solution.id == solution_id)
        .first()
    )

    if not solution:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Solution not found",
        )

    # Viewing an existing RealityCheck follows solution
    # portal visibility.
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
                "can view RealityCheck results"
            ),
        )

    result = get_reality_check_result(
        db,
        solution_id,
    )

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RealityCheck not found for this solution",
        )

    return result


@router.get(
    "/reality-checks/{reality_check_id}",
    response_model=RealityCheckResponse,
)
def get_reality_check(
    reality_check_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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
                "can view RealityCheck results"
            ),
        )

    result = db.execute(
        text(
            """
            SELECT
                id,
                solution_id,
                feasibility_score,
                overall_summary,
                confidence,
                uncertainty_notes,
                created_at
            FROM public.reality_checks
            WHERE id = :reality_check_id
            """
        ),
        {
            "reality_check_id": str(reality_check_id)
        },
    ).mappings().first()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RealityCheck not found",
        )

    risks = db.execute(
        text(
            """
            SELECT
                id,
                reality_check_id,
                risk_category,
                risk_description,
                risk_level,
                impact,
                mitigation,
                created_at
            FROM public.solution_risks
            WHERE reality_check_id = :reality_check_id
            ORDER BY created_at
            """
        ),
        {
            "reality_check_id": str(reality_check_id)
        },
    ).mappings().all()

    return {
        "id": result["id"],
        "solution_id": result["solution_id"],
        "feasibility_score": result["feasibility_score"],
        "overall_summary": result["overall_summary"],
        "confidence": result["confidence"],
        "uncertainty_notes": result["uncertainty_notes"],
        "created_at": result["created_at"],
        "risks": [
            {
                "id": risk["id"],
                "reality_check_id": risk["reality_check_id"],
                "risk_category": risk["risk_category"],
                "risk_description": risk["risk_description"],
                "risk_level": risk["risk_level"],
                "impact": risk["impact"],
                "mitigation": risk["mitigation"],
                "created_at": risk["created_at"],
            }
            for risk in risks
        ],
    }

