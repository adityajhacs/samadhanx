from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.database import get_db
from app.models.university import University
from app.schemas.university import UniversityResponse
from app.services.ai.university_matching import match_universities


router = APIRouter(
    prefix="/api/universities",
    tags=["Universities"]
)


@router.get("", response_model=list[UniversityResponse])
def get_universities(
    expertise: str | None = Query(default=None),
    district: str | None = Query(default=None),
    department: str | None = Query(default=None),
    db: Session = Depends(get_db)
):
    query = db.query(University)

    if district:
        query = query.filter(University.district == district)

    if department:
        query = query.filter(University.department == department)

    if expertise:
        query = query.filter(
            University.expertise_area.any(expertise)
        )

    universities = query.all()

    return universities


problem_university_router = APIRouter(
    prefix="/api/problems",
    tags=["University Matching"]
)


@problem_university_router.get(
    "/{problem_id}/universities"
)
def get_matched_universities(
    problem_id: UUID,
    limit: int = Query(default=5, ge=1, le=20),
    db: Session = Depends(get_db),
):
    return match_universities(
        problem_id=problem_id,
        db=db,
        limit=limit,
    )