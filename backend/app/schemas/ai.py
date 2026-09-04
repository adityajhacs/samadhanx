from pydantic import BaseModel, Field
from typing import List


class AIAnalysis(BaseModel):
    category: str = Field(
        description="Main category of the civic problem"
    )

    subcategory: str = Field(
        description="Specific subcategory of the civic problem"
    )

    severity_score: int = Field(
        ge=0,
        le=100,
        description="Severity score from 0 to 100"
    )

    severity_level: str = Field(
        description="Severity level: LOW, MEDIUM, HIGH, or CRITICAL"
    )

    affected_sector: str = Field(
        description="Sector affected by the problem"
    )

    estimated_affected_people: int = Field(
        ge=0,
        description="Estimated number of people affected"
    )

    root_cause: str = Field(
        description="Possible root cause inferred by AI"
    )

    ai_summary: str = Field(
        description="Short AI-generated summary of the problem"
    )

    keywords: List[str] = Field(
        description="Important keywords related to the problem"
    )