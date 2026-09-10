from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import httpx
import os

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
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
def register(data: RegisterRequest):
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
                "full_name": data.full_name
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
        "auth_id": str(current_user.auth_id) if current_user.auth_id else None,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
    }