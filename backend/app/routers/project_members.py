import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
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

project_members_router = APIRouter(
    prefix="/api/projects",
    tags=["Project Members"],
)
# ============================================================
# ADD PROJECT MEMBER
# ============================================================

@router.post(
    "",
    response_model=ProjectMemberResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_project_member(
    member_data: ProjectMemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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

    # Only project owner or ADMIN can add members
    if project.created_by != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this project",
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

@project_members_router.post(
    "/{project_id}/members",
    response_model=ProjectMemberResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_project_member_to_project(
    project_id: uuid.UUID,
    member_data: ProjectMemberCreate,
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

    if member_data.project_id != project_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project ID in request body does not match URL",
        )

    if project.created_by != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this project",
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
            ProjectMember.project_id == project_id,
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
        project_id=project_id,
        user_id=member_data.user_id,
        role=member_data.role,
        joined_at=datetime.now(timezone.utc),
    )

    db.add(member)
    db.commit()
    db.refresh(member)

    return member
# ============================================================
# GET PROJECT MEMBERS
# ============================================================

@router.get(
    "/project/{project_id}",
    response_model=list[ProjectMemberResponse],
)
def get_project_members(
    project_id: uuid.UUID,
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

    members = (
        db.query(ProjectMember)
        .filter(ProjectMember.project_id == project_id)
        .all()
    )

    return members

@project_members_router.get(
    "/{project_id}/members",
    response_model=list[ProjectMemberResponse],
)
def get_project_members_by_project(
    project_id: uuid.UUID,
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

    members = (
        db.query(ProjectMember)
        .filter(ProjectMember.project_id == project_id)
        .all()
    )

    return members
# ============================================================
# UPDATE PROJECT MEMBER
# ============================================================

@router.patch(
    "/{member_id}",
    response_model=ProjectMemberResponse,
)
def update_project_member(
    member_id: uuid.UUID,
    member_data: ProjectMemberUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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

    project = (
        db.query(Project)
        .filter(Project.id == member.project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    # Only project owner or ADMIN can update members
    if project.created_by != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this project",
        )

    update_data = member_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(member, field, value)

    db.commit()
    db.refresh(member)

    return member


# ============================================================
# DELETE PROJECT MEMBER
# ============================================================

@router.delete(
    "/{member_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_project_member(
    member_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
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

    project = (
        db.query(Project)
        .filter(Project.id == member.project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found",
        )

    # Only project owner or ADMIN can remove members
    if project.created_by != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this project",
        )

    db.delete(member)
    db.commit()

    return None
@project_members_router.delete(
    "/{project_id}/members/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_project_member_from_project(
    project_id: uuid.UUID,
    user_id: uuid.UUID,
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

    if project.created_by != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to modify this project",
        )

    member = (
        db.query(ProjectMember)
        .filter(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == user_id,
        )
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