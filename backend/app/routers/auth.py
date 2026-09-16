from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import httpx
import os
import uuid
from datetime import datetime, timezone

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.university import University
from app.models.industry_partner import IndustryPartner
from app.services.ai.embedding import generate_embedding

from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    UserResponse,
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


@router.post("/register", response_model=AuthResponse)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db),
):
    role = data.role.strip().lower()

    allowed_roles = {
        "citizen",
        "government",
        "university",
        "student",
        "faculty",
        "industry",
    }

    if role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail="Invalid role."
        )

    # -----------------------------
    # Validate role-specific fields
    # -----------------------------

    if role in {"student", "faculty"}:
        if not data.university_id:
            raise HTTPException(
                status_code=400,
                detail="University is required for students and faculty."
            )

        try:
            university_id = uuid.UUID(data.university_id)
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid university ID."
            )

        university = db.query(University).filter(
            University.id == university_id
        ).first()

        if not university:
            raise HTTPException(
                status_code=404,
                detail="Selected university was not found."
            )

    if role == "university":
        if not data.university_name or not data.university_name.strip():
            raise HTTPException(
                status_code=400,
                detail="University name is required."
            )

    if role == "industry":
        if not data.industry_name or not data.industry_name.strip():
            raise HTTPException(
                status_code=400,
                detail="Industry name is required."
            )

    # -----------------------------
    # Create Supabase Auth account
    # -----------------------------

    response = httpx.post(
        f"{SUPABASE_URL}/auth/v1/signup",
        headers={
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json",
        },
        json={
            "email": data.email,
            "password": data.password,
            "data": {
                "full_name": data.full_name,
                "role": role,
            },
        },
        timeout=10,
    )

    if response.status_code not in (200, 201):
        print("Supabase registration error:", response.text)

        raise HTTPException(
            status_code=response.status_code,
            detail=response.text
        )

    result = response.json()

    print("SUPABASE REGISTER RESULT:", result)

    auth_user_id = result.get("user", {}).get("id")

    if not auth_user_id:
        raise HTTPException(
            status_code=500,
            detail="Supabase user was created but user ID was not returned."
        )

    # -----------------------------
    # Find public.users row created
    # by handle_new_user()
    # -----------------------------

    public_user = db.query(User).filter(
        User.auth_id == uuid.UUID(auth_user_id)
    ).first()

    if not public_user:
        raise HTTPException(
            status_code=500,
            detail="User account created, but public user profile was not created."
        )

    # -----------------------------
    # Student / Faculty
    # -----------------------------

    if role in {"student", "faculty"}:
        public_user.university_id = uuid.UUID(data.university_id)

        if role == "student":
            from app.models.student_profile import StudentProfile

            profile = StudentProfile(
                user_id=public_user.id,
                course=data.course,
                year=data.year,
            )

            db.add(profile)

        elif role == "faculty":
            from app.models.faculty_profile import FacultyProfile

            profile = FacultyProfile(
                user_id=public_user.id,
                department=data.department,
                designation=data.designation,
            )

            db.add(profile)

    # -----------------------------
    # University
    # -----------------------------

    elif role == "university":
        university = University(
            id=uuid.uuid4(),
            name=data.university_name.strip(),
            expertise_area=data.expertise_area,
            district=data.district,
            department=data.department,
            created_at=datetime.now(timezone.utc),
        )

        db.add(university)
        db.flush()

        # -----------------------------
        # Generate University Embedding
        # -----------------------------

        university_text = f"""
University: {university.name}

Expertise Areas: {", ".join(university.expertise_area or [])}

District: {university.district}

Department: {university.department}
"""

        university.embedding = generate_embedding(university_text)

        public_user.university_id = university.id

    # -----------------------------
    # Industry
    # -----------------------------

    elif role == "industry":
        industry = IndustryPartner(
            id=uuid.uuid4(),
            name=data.industry_name.strip(),
            industry_type=data.industry_type,
            description=data.industry_description,
            location=data.industry_location,
            contact_email=data.industry_contact_email,
            created_at=datetime.now(timezone.utc),
        )

        db.add(industry)
        db.flush()

        public_user.industry_id = industry.id

    # -----------------------------
    # Save everything
    # -----------------------------

    db.commit()

    return {
        "access_token": result.get("access_token"),
        "refresh_token": result.get("refresh_token"),
        "token_type": "bearer",
    }


@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest):
    response = httpx.post(
        f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
        headers={
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json",
        },
        json={
            "email": data.email,
            "password": data.password,
        },
        timeout=10,
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    result = response.json()

    return {
        "access_token": result["access_token"],
        "refresh_token": result.get("refresh_token"),
        "token_type": result.get("token_type", "bearer"),
    }


@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": str(current_user.id),
        "auth_id": str(current_user.auth_id)
        if current_user.auth_id
        else None,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "university_id": (
            str(current_user.university_id)
            if current_user.university_id
            else None
        ),
        "industry_id": (
            str(current_user.industry_id)
            if current_user.industry_id
            else None
        ),
    }