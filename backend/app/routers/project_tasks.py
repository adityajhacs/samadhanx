import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db

from app.models.project import Project
from app.models.project_member import ProjectMember
from app.models.project_task import ProjectTask
from app.models.solution import Solution
from app.models.user import User

from app.schemas.project_task import (
    ProjectTaskCreate,
    ProjectTaskUpdate,
    ProjectTaskResponse,
)


router = APIRouter(
    prefix="/api/project-tasks",
    tags=["Project Tasks"],
)


# ============================================================
# HELPERS
# ============================================================

def get_project(
    project_id: uuid.UUID,
    db: Session,
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


def get_role(
    current_user: User,
) -> str:
    return (
        current_user.role or ""
    ).strip().lower()


def is_project_member(
    project_id: uuid.UUID,
    user_id: uuid.UUID,
    db: Session,
) -> bool:
    return (
        db.query(ProjectMember)
        .filter(
            ProjectMember.project_id == project_id,
            ProjectMember.user_id == user_id,
        )
        .first()
        is not None
    )


def belongs_to_same_university(
    project: Project,
    current_user: User,
    db: Session,
) -> bool:
    """
    Check whether the project belongs to
    the current user's university.

    Project
        ↓
    Solution
        ↓
    University
    """

    if not current_user.university_id:
        return False

    if not project.solution_id:
        return False

    solution = (
        db.query(Solution)
        .filter(
            Solution.id == project.solution_id
        )
        .first()
    )

    if not solution:
        return False

    return (
        solution.university_id
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
# VIEW PERMISSION
#
# University / Faculty / Student can VIEW all project tasks.
#
# Membership is NOT required for viewing.
#
# Other university content is read-only.
# ============================================================

def can_view_project_tasks(
    current_user: User,
) -> bool:

    role = get_role(current_user)

    return role in {
        "admin",
        "university",
        "faculty",
        "student",
        "industry",
        "government",
    }


# ============================================================
# CREATE TASK PERMISSION
#
# University:
#     Own university project.
#
# Faculty:
#     ONLY project creator.
#
# Student:
#     Can create task ONLY if they are
#     a member of the project.
#
# Admin:
#     Everything.
# ============================================================

def can_create_task(
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
    # ONLY project creator can create tasks.
    # --------------------------------------------------------

    if role == "faculty":
        return is_project_creator(
            project,
            current_user,
        )

    # --------------------------------------------------------
    # STUDENT
    #
    # Student can create tasks only in a project
    # where they are a ProjectMember.
    # --------------------------------------------------------

    if role == "student":
        return is_project_member(
            project.id,
            current_user.id,
            db,
        )

    return False


# ============================================================
# UPDATE TASK PERMISSION
#
# University:
#     Own university project → can update task.
#
# Project Creator Faculty:
#     Can update any task in their project.
#
# Other Faculty member:
#     Can update ONLY their own assigned task.
#
# Student:
#     Can update ONLY their own assigned task.
#
# Admin:
#     Everything.
# ============================================================

def can_update_task(
    task: ProjectTask,
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
    # Project creator:
    #     Can update any task.
    #
    # Other Faculty member:
    #     Only own assigned task.
    # --------------------------------------------------------

    if role == "faculty":

        if is_project_creator(
            project,
            current_user,
        ):
            return True

        return (
            is_project_member(
                project.id,
                current_user.id,
                db,
            )
            and task.assigned_to == current_user.id
        )

    # --------------------------------------------------------
    # STUDENT
    #
    # Student must:
    # 1. Be a project member
    # 2. Be assigned to this task
    # --------------------------------------------------------

    if role == "student":
        return (
            is_project_member(
                project.id,
                current_user.id,
                db,
            )
            and task.assigned_to == current_user.id
        )

    return False


# ============================================================
# DELETE TASK PERMISSION
#
# University:
#     Own university project.
#
# Faculty:
#     ONLY project creator.
#
# Student:
#     NEVER.
#
# Admin:
#     Everything.
# ============================================================

def can_delete_task(
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
    # Only project creator can delete tasks.
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
# VALIDATE ASSIGNED USER
# ============================================================

def validate_assigned_user(
    project: Project,
    assigned_user_id: uuid.UUID,
    current_user: User,
    db: Session,
):
    """
    Assigned user must:

    1. Exist
    2. Be Student or Faculty
    3. Belong to the same university
    4. Be a member of this project

    Admin can assign users across universities.
    """

    assigned_user = (
        db.query(User)
        .filter(
            User.id == assigned_user_id
        )
        .first()
    )

    if not assigned_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assigned user not found",
        )

    assigned_role = (
        assigned_user.role or ""
    ).strip().lower()

    if assigned_role not in {
        "student",
        "faculty",
    }:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Tasks can only be assigned "
                "to students or faculty"
            ),
        )

    # --------------------------------------------------------
    # Non-admin users can only assign users
    # from their own university.
    # --------------------------------------------------------

    if get_role(current_user) != "admin":

        if (
            not current_user.university_id
            or assigned_user.university_id
            != current_user.university_id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "You can only assign tasks to users "
                    "from your university"
                ),
            )

    # --------------------------------------------------------
    # Assigned user must be project member.
    # --------------------------------------------------------

    if not is_project_member(
        project.id,
        assigned_user.id,
        db,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Assigned user is not a "
                "member of this project"
            ),
        )


# ============================================================
# VALIDATE TASK STATUS
# ============================================================

def validate_task_status(
    task_status: str | None,
) -> str:

    normalized_status = (
        task_status or "PENDING"
    ).upper()

    if normalized_status not in {
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED",
    }:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid task status",
        )

    return normalized_status


# ============================================================
# GET PROJECT TASKS
#
# University / Faculty / Student can VIEW tasks.
#
# No project membership is required.
# ============================================================

@router.get(
    "/project/{project_id}",
    response_model=list[ProjectTaskResponse],
)
def get_project_tasks(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project(
        project_id,
        db,
    )

    if not can_view_project_tasks(
        current_user,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized to "
                "view project tasks"
            ),
        )

    tasks = (
        db.query(ProjectTask)
        .filter(
            ProjectTask.project_id == project.id
        )
        .order_by(
            ProjectTask.created_at.asc()
        )
        .all()
    )

    return tasks


# ============================================================
# CREATE TASK
#
# University:
#     Own university project.
#
# Faculty:
#     Project creator only.
#
# Student:
#     Project member.
#
# Admin:
#     Everything.
# ============================================================

@router.post(
    "/project/{project_id}",
    response_model=ProjectTaskResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_project_task(
    project_id: uuid.UUID,
    task_data: ProjectTaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project(
        project_id,
        db,
    )

    if not can_create_task(
        project,
        current_user,
        db,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized to "
                "create tasks for this project"
            ),
        )

    # --------------------------------------------------------
    # Validate assigned user
    # --------------------------------------------------------

    if task_data.assigned_to:

        validate_assigned_user(
            project=project,
            assigned_user_id=task_data.assigned_to,
            current_user=current_user,
            db=db,
        )

    # --------------------------------------------------------
    # Validate status
    # --------------------------------------------------------

    task_status = validate_task_status(
        task_data.status
    )

    # --------------------------------------------------------
    # Create task
    # --------------------------------------------------------

    task = ProjectTask(
        project_id=project.id,
        title=task_data.title,
        description=task_data.description,
        assigned_to=task_data.assigned_to,
        status=task_status,
        created_by=current_user.id,
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


# ============================================================
# UPDATE TASK
#
# Project Creator Faculty:
#     Can update any task.
#
# Other Faculty:
#     Only own assigned task.
#
# Student:
#     Only own assigned task.
#
# University:
#     Own university project.
#
# Admin:
#     Everything.
# ============================================================

@router.patch(
    "/{task_id}",
    response_model=ProjectTaskResponse,
)
def update_project_task(
    task_id: uuid.UUID,
    task_data: ProjectTaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = (
        db.query(ProjectTask)
        .filter(
            ProjectTask.id == task_id
        )
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    project = get_project(
        task.project_id,
        db,
    )

    role = get_role(
        current_user
    )

    # --------------------------------------------------------
    # AUTHORIZATION
    # --------------------------------------------------------

    if not can_update_task(
        task,
        project,
        current_user,
        db,
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "You are not authorized to "
                "update this task"
            ),
        )

    update_data = task_data.model_dump(
        exclude_unset=True
    )

    # --------------------------------------------------------
    # STUDENT RESTRICTIONS
    # --------------------------------------------------------

    if role == "student":

        # Student cannot reassign
        if "assigned_to" in update_data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Students cannot reassign "
                    "project tasks"
                ),
            )

        # Student cannot move task
        # to another project
        if "project_id" in update_data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Students cannot move tasks "
                    "between projects"
                ),
            )

        # Student cannot change creator
        if "created_by" in update_data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Students cannot change "
                    "task ownership"
                ),
            )

    # --------------------------------------------------------
    # NON-CREATOR FACULTY RESTRICTIONS
    # --------------------------------------------------------

    if role == "faculty" and not is_project_creator(
        project,
        current_user,
    ):

        if "assigned_to" in update_data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Only the project creator can "
                    "reassign project tasks"
                ),
            )

        if "project_id" in update_data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Only the project creator can "
                    "move tasks between projects"
                ),
            )

        if "created_by" in update_data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    "Only the project creator can "
                    "change task ownership"
                ),
            )

    # --------------------------------------------------------
    # VALIDATE ASSIGNED USER
    # --------------------------------------------------------

    if "assigned_to" in update_data:

        assigned_to = update_data["assigned_to"]

        if assigned_to:

            validate_assigned_user(
                project=project,
                assigned_user_id=assigned_to,
                current_user=current_user,
                db=db,
            )

    # --------------------------------------------------------
    # VALIDATE STATUS
    # --------------------------------------------------------

    if "status" in update_data:

        update_data["status"] = validate_task_status(
            update_data["status"]
        )

    # --------------------------------------------------------
    # APPLY UPDATE
    # --------------------------------------------------------

    for field, value in update_data.items():
        setattr(
            task,
            field,
            value,
        )

    db.commit()
    db.refresh(task)

    return task


# ============================================================
# DELETE TASK
#
# Student:
#     NEVER.
#
# Non-owner Faculty:
#     NEVER.
#
# Project Creator Faculty:
#     Allowed.
#
# University:
#     Own university project.
#
# Admin:
#     Everything.
# ============================================================

@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_project_task(
    task_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = (
        db.query(ProjectTask)
        .filter(
            ProjectTask.id == task_id
        )
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    project = get_project(
        task.project_id,
        db,
    )

    if not can_delete_task(
        project,
        current_user,
        db,
    ):
        role = get_role(
            current_user
        )

        if role == "student":
            detail = (
                "Students are not allowed "
                "to delete tasks"
            )

        elif role == "faculty":
            detail = (
                "Only the faculty who created "
                "this project can delete its tasks"
            )

        else:
            detail = (
                "You are not authorized "
                "to delete this task"
            )

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
        )

    db.delete(task)
    db.commit()

    return None