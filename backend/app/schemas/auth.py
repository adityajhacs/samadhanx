from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str

    # Student
    university_id: str | None = None
    course: str | None = None
    year: str | None = None

    # Faculty
    department: str | None = None
    designation: str | None = None

    # University
    university_name: str | None = None
    expertise_area: list[str] | None = None
    district: str | None = None

    # Industry
    industry_name: str | None = None
    industry_type: str | None = None
    industry_description: str | None = None
    industry_location: str | None = None
    industry_contact_email: str | None = None


class AuthResponse(BaseModel):
    access_token: str | None = None
    refresh_token: str | None = None
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    auth_id: str | None = None
    full_name: str
    email: str
    role: str
    university_id: str | None = None
    industry_id: str | None = None