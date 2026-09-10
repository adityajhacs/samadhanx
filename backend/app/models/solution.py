import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import Text, TIMESTAMP, Numeric, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Solution(Base):
    __tablename__ = "solutions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()")
    )

    problem_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("problems.id"),
        nullable=True
    )

    university_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("universities.id"),
        nullable=True
    )

    project_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("projects.id"),
        nullable=True
    )

    solution_title: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    prototype_status: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        server_default=text("'Idea'")
    )

    estimated_cost: Mapped[Decimal | None] = mapped_column(
        Numeric,
        nullable=True
    )

    funding_received: Mapped[Decimal | None] = mapped_column(
        Numeric,
        nullable=True,
        server_default=text("0")
    )

    created_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=True,
        server_default=text("now()")
    )