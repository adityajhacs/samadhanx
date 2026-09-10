
from pydantic import BaseModel, Field


class SupportResponse(BaseModel):
    supported: bool
    supporters: int
    message: str


class FeedbackCreate(BaseModel):
    feedback: str = Field(..., min_length=1)


class FeedbackResponse(BaseModel):
    message: str

