import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db

from app.models.project_member import ProjectMember
from app.models.project import Project
from app.models.solution import Solution
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
# HELPERS
# ============================================================

def get_role(
    current_user: User,
) -> str:
    return (
        current_user.role or ""
    ).strip().lower()


def get_project(
    project_id: uuid.UUID,
    db: Session,
) -> Project:
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


def get_project_university_id(
    project: Project,
    db: Session,
):
    """
    Determine project university through:

    Project
        ↓
    Solution
        ↓
    University
    """

    if not project.solution_id:
        return None

    solution = (
        db.query(Solution)
        .filter(
            Solution.id == project.solution_id
        )
        .first()
    )

    if not solution:
        return None

    return solution.university_id


def belongs_to_same_university(
    project: Project,
    current_user: User,
    db: Session,
) -> bool:
    if not current_user.university_id:
        return False

    project_university_id = get_project_university_id(
        project,
        db,
    )

    if not project_university_id:
        return False

    return (
        project_university_id
        == current_user.university_id
    )


def is_project_creator(
    project: Project,
    current_user: User,
) -> bool:
    """
    The Faculty who created the project
    is the project owner/manager.
    """

    return project.created_by == current_user.id


# ============================================================
# MEMBER MANAGEMENT PERMISSION
#
# Admin:
#     All projects.
#
# University:
#     Own university projects.
#
# Project creator Faculty:
#     Own project.
#
# Other Faculty:
#     Cannot manage members.
#
# Student:
#     Cannot manage members.
# ============================================================

def can_manage_project_members(
    project: Project,
    current_user: User,
    db: Session,
) -> bool:

    role = get_role(current_user)

    # --------------------------------------------------------
    # ADMIN
    # --------------------------------------------------------

    if role == "admin":
        return True

    # --------------------------------------------------------
    # UNIVERSITY
    # --------------------------------------------------------

    if role == "university":
        return belongs_to_same_university(
            project,
            current_user,
            db,
        )

    # --------------------------------------------------------
    # FACULTY
    #
    # ONLY project creator can manage members.
    # Being a ProjectMember does NOT grant management rights.
    # --------------------------------------------------------

    if role == "faculty":
        return is_project_creator(
            project,
            current_user,
        )

    # --------------------------------------------------------
    # STUDENT
    # --------------------------------------------------------

    if role == "student":
        return False

    return False


# ============================================================
# VALIDATE MEMBER USER
#
# Member must:
#     1. Exist
#     2. Be Student or Faculty
#     3. Belong to project's university
# ============================================================

def validate_member_user(
    project: Project,
    user_id: uuid.UUID,
    db: Session,
):
    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    role = (
        user.role or ""
    ).strip().lower()

    if role not in {
        "student",
        "faculty",
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only Student or Faculty users "
                "can be added to a project"
            ),
        )

    project_university_id = get_project_university_id(
        project,
        db,
    )

    if not project_university_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Project is not associated "
                "with a university"
            ),
        )

    if user.university_id != project_university_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only Student or Faculty users "
                "from the project's university "
                "can be added"
            ),
        )

    return user


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
    project = get_project(
        member_data.project_id,
        db,
    )

    # --------------------------------------------------------
    # AUTHORIZATION
    # --------------------------------------------------------

    if not can_manage_project_members(
        project,
        current_user,
        db,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized to "
                "manage members of this project"
            ),
        )

    # --------------------------------------------------------
    # VALIDATE USER
    # --------------------------------------------------------

    validate_member_user(
        project,
        member_data.user_id,
        db,
    )

    # --------------------------------------------------------
    # CHECK DUPLICATE
    # --------------------------------------------------------

    existing_member = (
        db.query(ProjectMember)
        .filter(
            ProjectMember.project_id
            == member_data.project_id,
            ProjectMember.user_id
            == member_data.user_id,
        )
        .first()
    )

    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User is already a member of this project",
        )

    # --------------------------------------------------------
    # CREATE MEMBER
    # --------------------------------------------------------

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


# ============================================================
# ADD MEMBER USING PROJECT URL
# ============================================================

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
    project = get_project(
        project_id,
        db,
    )

    if member_data.project_id != project_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project ID in request body does not match URL",
        )

    # --------------------------------------------------------
    # AUTHORIZATION
    # --------------------------------------------------------

    if not can_manage_project_members(
        project,
        current_user,
        db,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized to "
                "manage members of this project"
            ),
        )

    # --------------------------------------------------------
    # VALIDATE USER
    # --------------------------------------------------------

    validate_member_user(
        project,
        member_data.user_id,
        db,
    )

    # --------------------------------------------------------
    # CHECK DUPLICATE
    # --------------------------------------------------------

    existing_member = (
        db.query(ProjectMember)
        .filter(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id
            == member_data.user_id,
        )
        .first()
    )

    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User is already a member of this project",
        )

    # --------------------------------------------------------
    # CREATE MEMBER
    # --------------------------------------------------------

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
#
# University / Faculty / Student can VIEW members
# of ANY project.
#
# No membership or university restriction.
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
    project = get_project(
        project_id,
        db,
    )

    role = get_role(current_user)

    if role not in {
        "admin",
        "university",
        "faculty",
        "student",
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized to "
                "view project members"
            ),
        )

    members = (
        db.query(ProjectMember)
        .filter(
            ProjectMember.project_id == project.id
        )
        .all()
    )

    return members


# ============================================================
# GET PROJECT MEMBERS USING PROJECT URL
#
# Read-only for all University Portal roles.
# ============================================================

@project_members_router.get(
    "/{project_id}/members",
    response_model=list[ProjectMemberResponse],
)
def get_project_members_by_project(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project(
        project_id,
        db,
    )

    role = get_role(current_user)

    if role not in {
        "admin",
        "university",
        "faculty",
        "student",
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized to "
                "view project members"
            ),
        )

    members = (
        db.query(ProjectMember)
        .filter(
            ProjectMember.project_id == project.id
        )
        .all()
    )

    return members


# ============================================================
# UPDATE PROJECT MEMBER
#
# Admin:
#     All.
#
# University:
#     Own university project.
#
# Project creator Faculty:
#     Own project.
#
# Other Faculty:
#     Not allowed.
#
# Student:
#     Not allowed.
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
        .filter(
            ProjectMember.id == member_id
        )
        .first()
    )

    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project member not found",
        )

    project = get_project(
        member.project_id,
        db,
    )

    # --------------------------------------------------------
    # AUTHORIZATION
    # --------------------------------------------------------

    if not can_manage_project_members(
        project,
        current_user,
        db,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized to "
                "modify project members"
            ),
        )

    update_data = member_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            member,
            field,
            value,
        )

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
        .filter(
            ProjectMember.id == member_id
        )
        .first()
    )

    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project member not found",
        )

    project = get_project(
        member.project_id,
        db,
    )

    # --------------------------------------------------------
    # AUTHORIZATION
    # --------------------------------------------------------

    if not can_manage_project_members(
        project,
        current_user,
        db,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized to "
                "remove project members"
            ),
        )

    db.delete(member)
    db.commit()

    return None


# ============================================================
# DELETE PROJECT MEMBER USING PROJECT URL
# ============================================================

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
    project = get_project(
        project_id,
        db,
    )

    # --------------------------------------------------------
    # AUTHORIZATION
    # --------------------------------------------------------

    if not can_manage_project_members(
        project,
        current_user,
        db,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized to "
                "remove project members"
            ),
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


# ============================================================
# GET PROJECT MEMBER DETAILS
#
# Read-only.
# University / Faculty / Student can view
# details for ANY project.
# ============================================================

@project_members_router.get(
    "/{project_id}/members/details",
)
def get_project_member_details(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project(
        project_id,
        db,
    )

    role = get_role(current_user)

    if role not in {
        "admin",
        "university",
        "faculty",
        "student",
        "government",
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized to "
                "view project member details"
            ),
        )

    members = (
        db.query(ProjectMember, User)
        .join(
            User,
            ProjectMember.user_id == User.id,
        )
        .filter(
            ProjectMember.project_id == project.id
        )
        .all()
    )

    return [
        {
            "id": member.id,
            "user_id": user.id,
            "name": user.full_name,
            "email": user.email,
            "role": user.role,
            "project_role": member.role,
            "joined_at": member.joined_at,
        }
        for member, user in members
    ]