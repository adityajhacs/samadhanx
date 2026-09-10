from pydantic import BaseModel


class UniversityResponse(BaseModel):
    id: str
    name: str
    expertise_areas: list[str]