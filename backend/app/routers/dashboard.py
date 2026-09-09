import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.project import Project
from app.models.industry_partner import IndustryPartner
from app.models.collaboration import Collaboration
from app.schemas.dashboard import (
    DashboardOverviewResponse,
    ProjectStatusResponse,
    CollaborationSummaryResponse,
    IndustryPartnerSummaryResponse,
    ProjectDashboardResponse,
    ProjectDashboardListResponse,
)
from app.models.project_member import ProjectMember
router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/overview",
    response_model=DashboardOverviewResponse,
)
def get_dashboard_overview(
    db: Session = Depends(get_db),
):
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
                0
            )
        )
        .scalar()
    )

    return {
        "total_projects": total_projects,
        "active_projects": active_projects,
        "total_industry_partners": total_industry_partners,
        "total_collaborations": total_collaborations,
        "active_collaborations": active_collaborations,
        "total_funding": float(total_funding),
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
                0
            )
        )
        .scalar()
    )

    return {
        "total_collaborations": total_collaborations,
        "pending_collaborations": pending_collaborations,
        "approved_collaborations": approved_collaborations,
        "active_collaborations": active_collaborations,
        "total_funding": float(total_funding),
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
                    0
                )
            )
            .filter(Collaboration.project_id == project.id)
            .scalar()
        )

        result.append({
            "id": str(project.id),
            "title": project.title,
            "status": project.status,
            "team_size": team_size,
            "collaborations": collaborations,
            "total_funding": float(total_funding),
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
                0
            )
        )
        .filter(Collaboration.project_id == project_id)
        .scalar()
    )

    return {
        "id": str(project.id),
        "title": project.title,
        "status": project.status,
        "team_size": team_size,
        "collaborations": collaborations,
        "total_funding": float(total_funding),
    }
