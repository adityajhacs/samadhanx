import uuid
from datetime import datetime

from sqlalchemy import Text, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ProblemAIAnalysis(Base):
    __tablename__ = "problem_ai_analysis"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True
    )

    problem_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("problems.id")
    )

    subcategory: Mapped[str] = mapped_column(Text)

    severity_level: Mapped[str] = mapped_column(Text)

    affected_sector: Mapped[str] = mapped_column(Text)

    estimated_affected_people: Mapped[int] = mapped_column(Integer)

    root_cause: Mapped[str] = mapped_column(Text)

    ai_summary: Mapped[str] = mapped_column(Text)

    keywords: Mapped[list[str]] = mapped_column(
        ARRAY(Text)
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True)
    )