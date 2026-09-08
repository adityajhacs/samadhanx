import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.project import Project
from app.models.problem import Problem
from app.models.solution import Solution
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
)


router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"],
)


@router.get(
    "",
    response_model=list[ProjectResponse]
)
def get_projects(
    db: Session = Depends(get_db),
):
    projects = db.query(Project).all()
    return projects


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


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
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
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


@router.patch(
    "/{project_id}",
    response_model=ProjectResponse,
)
def update_project(
    project_id: uuid.UUID,
    project_data: ProjectUpdate,
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

    update_data = project_data.model_dump(
        exclude_unset=True
    )

    if (
        "problem_id" in update_data
        and update_data["problem_id"] is not None
    ):
        problem = (
            db.query(Problem)
            .filter(Problem.id == update_data["problem_id"])
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
            .filter(Solution.id == update_data["solution_id"])
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