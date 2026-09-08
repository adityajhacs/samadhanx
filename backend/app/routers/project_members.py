import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.project_member import ProjectMember
from app.models.project import Project
from app.models.user import User
from app.schemas.project_member import (
    ProjectMemberCreate,
    ProjectMemberUpdate,
    ProjectMemberResponse,
)


router = APIRouter(
    prefix="/api/project-members",
    tags=["Project Members"],
)


@router.post(
    "",
    response_model=ProjectMemberResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_project_member(
    member_data: ProjectMemberCreate,
    db: Session = Depends(get_db),
):
    project = (
        db.query(Project)
        .filter(Project.id == member_data.project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    user = (
        db.query(User)
        .filter(User.id == member_data.user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    existing_member = (
        db.query(ProjectMember)
        .filter(
            ProjectMember.project_id == member_data.project_id,
            ProjectMember.user_id == member_data.user_id,
        )
        .first()
    )

    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User is already a member of this project",
        )

    member = ProjectMember(
        project_id=member_data.project_id,
        user_id=member_data.user_id,
        role=member_data.role,
        joined_at=datetime.now(timezone.utc),
    )

    db.add(member)
    db.commit()
    db.refresh(member)

    return member


@router.get(
    "/project/{project_id}",
    response_model=list[ProjectMemberResponse],
)
def get_project_members(
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

    members = (
        db.query(ProjectMember)
        .filter(ProjectMember.project_id == project_id)
        .all()
    )

    return members


@router.patch(
    "/{member_id}",
    response_model=ProjectMemberResponse,
)
def update_project_member(
    member_id: uuid.UUID,
    member_data: ProjectMemberUpdate,
    db: Session = Depends(get_db),
):
    member = (
        db.query(ProjectMember)
        .filter(ProjectMember.id == member_id)
        .first()
    )

    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project member not found",
        )

    update_data = member_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(member, field, value)

    db.commit()
    db.refresh(member)

    return member


@router.delete(
    "/{member_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_project_member(
    member_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    member = (
        db.query(ProjectMember)
        .filter(ProjectMember.id == member_id)
        .first()
    )

    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project member not found",
        )

    db.delete(member)
    db.commit()

    return None