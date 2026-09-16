from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.core.database import get_db
from app.models.user import User


router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
)


# ============================================================
# GET UNIVERSITY MEMBERS
#
# VIEW ONLY
#
# University:
#     Can view members of its university.
#
# Faculty:
#     Can view members of its university.
#
# Student:
#     Can view members of its university.
#
# Other users:
#     No access.
#
# This endpoint does NOT give any edit/manage permission.
# ============================================================

@router.get("/university-members")
def get_university_members(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    role = (
        current_user.role or ""
    ).strip().lower()

    # --------------------------------------------------------
    # Only University Portal roles can view members
    # --------------------------------------------------------

    if role not in {
        "university",
        "faculty",
        "student",
    }:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=(
                "Only university, faculty, and "
                "student users can view university members"
            ),
        )

    # --------------------------------------------------------
    # User must have a linked university
    # --------------------------------------------------------

    if not current_user.university_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No university is linked to this account",
        )

    # --------------------------------------------------------
    # Get students and faculty of the same university
    # --------------------------------------------------------

    members = (
        db.query(User)
        .filter(
            User.university_id == current_user.university_id,
            User.role.in_([
                "student",
                "faculty",
            ]),
        )
        .order_by(
            User.full_name.asc()
        )
        .all()
    )

    # --------------------------------------------------------
    # Return read-only member information
    # --------------------------------------------------------

    return [
        {
            "id": member.id,
            "full_name": member.full_name,
            "email": member.email,
            "role": (
                member.role or ""
            ).upper(),
            "university_id": member.university_id,
        }
        for member in members
    ]