
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.problem import Problem
from app.models.problem_ai_analysis import ProblemAIAnalysis
from app.models.university_problem_interest import UniversityProblemInterest
from app.models.solution import Solution
from app.models.project import Project
from app.models.industry_partner import IndustryPartner
from app.models.collaboration import Collaboration
from app.models.project_member import ProjectMember

from app.schemas.dashboard import (
    DashboardOverviewResponse,
    ProjectStatusResponse,
    CollaborationSummaryResponse,
    IndustryPartnerSummaryResponse,
    ProjectDashboardResponse,
    ProjectDashboardListResponse,
)


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)

project_dashboard_router = APIRouter(
    prefix="/api/projects",
    tags=["Dashboard"],
)


@router.get(
    "/overview",
    response_model=DashboardOverviewResponse,
)
def get_dashboard_overview(
    db: Session = Depends(get_db),
):
    # ---------------------------------------------------------
    # Existing dashboard statistics
    # ---------------------------------------------------------

    total_projects = db.query(Project).count()

    active_projects = (
        db.query(Project)
        .filter(
            Project.status.notin_([
                "DEPLOYED",
                "IMPACT_MEASUREMENT",
            ])
        )
        .count()
    )

    total_industry_partners = (
        db.query(IndustryPartner).count()
    )

    total_collaborations = (
        db.query(Collaboration).count()
    )

    active_collaborations = (
        db.query(Collaboration)
        .filter(
            Collaboration.status.in_([
                "PENDING",
                "APPROVED",
                "ACTIVE",
            ])
        )
        .count()
    )

    total_funding = (
        db.query(
            func.coalesce(
                func.sum(Collaboration.amount),
                0,
            )
        )
        .scalar()
    )

    # ---------------------------------------------------------
    # Solution Lifecycle
    # ---------------------------------------------------------

    # 1. Reported
    # Every problem in the problems table.
    reported_count = (
        db.query(Problem.id)
        .count()
    )

    # 2. AI Analysis
    # Count unique problems which have an AI analysis record.
    ai_analysis_count = (
        db.query(
            func.count(
                func.distinct(ProblemAIAnalysis.problem_id)
            )
        )
        .scalar()
    )

    # 3. University Matching
    # Count unique problems which have at least one
    # university interest/matching record.
    university_matching_count = (
        db.query(
            func.count(
                func.distinct(
                    UniversityProblemInterest.problem_id
                )
            )
        )
        .scalar()
    )

    # 4. Solution
    # Count unique problems having at least one solution.
    solution_count = (
        db.query(
            func.count(
                func.distinct(Solution.problem_id)
            )
        )
        .filter(
            Solution.problem_id.isnot(None)
        )
        .scalar()
    )

    # 5. Project
    # Count unique problems having at least one project.
    project_count = (
        db.query(
            func.count(
                func.distinct(Project.problem_id)
            )
        )
        .filter(
            Project.problem_id.isnot(None)
        )
        .scalar()
    )

    # 6. Industry Support
    # Count collaborations.
    industry_support_count = (
        db.query(Collaboration)
        .count()
    )

    # 7. Prototype
    # Count unique problems whose solution has reached
    # prototype-related status.
    prototype_count = (
        db.query(
            func.count(
                func.distinct(Solution.problem_id)
            )
        )
        .filter(
            Solution.problem_id.isnot(None),
            func.upper(
                func.coalesce(
                    Solution.prototype_status,
                    "",
                )
            ).in_([
                "PROTOTYPE",
                "FIELD_TEST",
                "DEPLOYED",
            ]),
        )
        .scalar()
    )

    # 8. Deployment
    # Count unique problems whose project is deployed.
    deployment_count = (
        db.query(
            func.count(
                func.distinct(Project.problem_id)
            )
        )
        .filter(
            Project.problem_id.isnot(None),
            func.upper(
                func.coalesce(
                    Project.status,
                    "",
                )
            ) == "DEPLOYED",
        )
        .scalar()
    )

    # 9. Resolved
    # Count problems whose status is Resolved.
    resolved_count = (
        db.query(Problem)
        .filter(
            func.upper(
                func.coalesce(
                    Problem.status,
                    "",
                )
            ) == "RESOLVED"
        )
        .count()
    )

    return {
        "total_projects": total_projects,
        "active_projects": active_projects,
        "total_industry_partners": total_industry_partners,
        "total_collaborations": total_collaborations,
        "active_collaborations": active_collaborations,
        "total_funding": float(total_funding or 0),

        # Lifecycle counts
        "reported_count": reported_count,
        "ai_analysis_count": ai_analysis_count,
        "university_matching_count": university_matching_count,
        "solution_count": solution_count,
        "project_count": project_count,
        "industry_support_count": industry_support_count,
        "prototype_count": prototype_count,
        "deployment_count": deployment_count,
        "resolved_count": resolved_count,
    }


@router.get(
    "/project-status",
    response_model=ProjectStatusResponse,
)
def get_project_status(
    db: Session = Depends(get_db),
):
    statuses = [
        "IDEA",
        "VALIDATION",
        "TEAM_FORMATION",
        "SOLUTION_DESIGN",
        "PROTOTYPE",
        "FIELD_PILOT",
        "DEPLOYED",
        "IMPACT_MEASUREMENT",
    ]

    result = {}

    for project_status in statuses:
        count = (
            db.query(Project)
            .filter(Project.status == project_status)
            .count()
        )

        result[project_status] = count

    return result


@router.get(
    "/collaboration-summary",
    response_model=CollaborationSummaryResponse,
)
def get_collaboration_summary(
    db: Session = Depends(get_db),
):
    total_collaborations = (
        db.query(Collaboration).count()
    )

    pending_collaborations = (
        db.query(Collaboration)
        .filter(Collaboration.status == "PENDING")
        .count()
    )

    approved_collaborations = (
        db.query(Collaboration)
        .filter(Collaboration.status == "APPROVED")
        .count()
    )

    active_collaborations = (
        db.query(Collaboration)
        .filter(Collaboration.status == "ACTIVE")
        .count()
    )

    total_funding = (
        db.query(
            func.coalesce(
                func.sum(Collaboration.amount),
                0,
            )
        )
        .scalar()
    )

    return {
        "total_collaborations": total_collaborations,
        "pending_collaborations": pending_collaborations,
        "approved_collaborations": approved_collaborations,
        "active_collaborations": active_collaborations,
        "total_funding": float(total_funding or 0),
    }


@router.get(
    "/industry-partners",
    response_model=IndustryPartnerSummaryResponse,
)
def get_industry_partner_summary(
    db: Session = Depends(get_db),
):
    total_industry_partners = (
        db.query(IndustryPartner).count()
    )

    return {
        "total_industry_partners": total_industry_partners,
    }


@router.get(
    "/projects",
    response_model=ProjectDashboardListResponse,
)
def get_projects_dashboard(
    db: Session = Depends(get_db),
):
    projects = (
        db.query(Project)
        .order_by(Project.title)
        .all()
    )

    result = []

    for project in projects:
        team_size = (
            db.query(ProjectMember)
            .filter(ProjectMember.project_id == project.id)
            .count()
        )

        collaborations = (
            db.query(Collaboration)
            .filter(Collaboration.project_id == project.id)
            .count()
        )

        total_funding = (
            db.query(
                func.coalesce(
                    func.sum(Collaboration.amount),
                    0,
                )
            )
            .filter(
                Collaboration.project_id == project.id
            )
            .scalar()
        )

        result.append({
            "id": str(project.id),
            "title": project.title,
            "status": project.status,
            "team_size": team_size,
            "collaborations": collaborations,
            "total_funding": float(total_funding or 0),
        })

    return {
        "projects": result
    }


@router.get(
    "/projects/{project_id}",
    response_model=ProjectDashboardResponse,
)
def get_project_dashboard(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    team_size = (
        db.query(ProjectMember)
        .filter(ProjectMember.project_id == project_id)
        .count()
    )

    collaborations = (
        db.query(Collaboration)
        .filter(Collaboration.project_id == project_id)
        .count()
    )

    total_funding = (
        db.query(
            func.coalesce(
                func.sum(Collaboration.amount),
                0,
            )
        )
        .filter(
            Collaboration.project_id == project_id
        )
        .scalar()
    )

    return {
        "id": str(project.id),
        "title": project.title,
        "status": project.status,
        "team_size": team_size,
        "collaborations": collaborations,
        "total_funding": float(total_funding or 0),
    }


@project_dashboard_router.get(
    "/{project_id}/dashboard",
    response_model=ProjectDashboardResponse,
)
def get_project_dashboard_by_project(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found",
        )

    team_size = (
        db.query(ProjectMember)
        .filter(ProjectMember.project_id == project_id)
        .count()
    )

    collaborations = (
        db.query(Collaboration)
        .filter(Collaboration.project_id == project_id)
        .count()
    )

    total_funding = (
        db.query(
            func.coalesce(
                func.sum(Collaboration.amount),
                0,
            )
        )
        .filter(
            Collaboration.project_id == project_id
        )
        .scalar()
    )

    return {
        "id": str(project.id),
        "title": project.title,
        "status": project.status,
        "team_size": team_size,
        "collaborations": collaborations,
        "total_funding": float(total_funding or 0),
    }

