import uuid
from datetime import datetime

from sqlalchemy import Text, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class UniversityProblemInterest(Base):
    __tablename__ = "university_problem_interest"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()")
    )

    university_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("universities.id", ondelete="CASCADE"),
        nullable=False
    )

    problem_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("problems.id", ondelete="CASCADE"),
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=text("now()"),
        nullable=False
    )