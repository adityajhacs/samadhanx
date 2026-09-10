import uuid

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.project import Project
from app.models.problem import Problem
from app.models.solution import Solution
from app.models.university import University
from app.models.user import User
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
)


router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"],
)


# ============================================================
# GET PROJECTS WITH FILTERS
# ============================================================

@router.get(
    "",
    response_model=list[ProjectResponse]
)
def get_projects(
    status_filter: str | None = Query(
        default=None,
        alias="status"
    ),
    district: str | None = None,
    university_id: uuid.UUID | None = None,
    problem_id: uuid.UUID | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Project)

    # Filter by project status
    if status_filter:
        query = query.filter(
            Project.status == status_filter
        )

    # Filter by problem
    if problem_id:
        query = query.filter(
            Project.problem_id == problem_id
        )

    # Filter by university
    if university_id:
        query = (
            query
            .join(
                Solution,
                Project.solution_id == Solution.id
            )
            .filter(
                Solution.university_id == university_id
            )
        )

    # Filter by district
    if district:
        query = (
            query
            .join(
                Solution,
                Project.solution_id == Solution.id
            )
            .join(
                University,
                Solution.university_id == University.id
            )
            .filter(
                University.district == district
            )
        )

    projects = query.all()

    return projects


# ============================================================
# GET SINGLE PROJECT
# ============================================================

@router.get(
    "/{project_id}",
    response_model=ProjectResponse
)
def get_project(
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
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    return project


# ============================================================
# CREATE PROJECT
# ============================================================

@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if project_data.problem_id:
        problem = (
            db.query(Problem)
            .filter(Problem.id == project_data.problem_id)
            .first()
        )

        if not problem:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Problem not found",
            )

    if project_data.solution_id:
        solution = (
            db.query(Solution)
            .filter(Solution.id == project_data.solution_id)
            .first()
        )

        if not solution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Solution not found",
            )

    project = Project(
        problem_id=project_data.problem_id,
        solution_id=project_data.solution_id,
        title=project_data.title,
        description=project_data.description,
        status=project_data.status,
        created_by=current_user.id,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


# ============================================================
# UPDATE PROJECT
# ============================================================

@router.patch(
    "/{project_id}",
    response_model=ProjectResponse,
)
def update_project(
    project_id: uuid.UUID,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    # Only project owner or ADMIN can modify
    if (
        project.created_by != current_user.id
        and current_user.role != "ADMIN"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this project",
        )

    update_data = project_data.model_dump(
        exclude_unset=True
    )

    if (
        "problem_id" in update_data
        and update_data["problem_id"] is not None
    ):
        problem = (
            db.query(Problem)
            .filter(
                Problem.id == update_data["problem_id"]
            )
            .first()
        )

        if not problem:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Problem not found",
            )

    if (
        "solution_id" in update_data
        and update_data["solution_id"] is not None
    ):
        solution = (
            db.query(Solution)
            .filter(
                Solution.id == update_data["solution_id"]
            )
            .first()
        )

        if not solution:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Solution not found",
            )

    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)

    return project