import uuid
from datetime import datetime
from sqlalchemy import Text, TIMESTAMP, ForeignKey, text, Integer, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Project(Base):
    __tablename__ = "projects"

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

    solution_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("solutions.id"),
        nullable=True
    )

    title: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    status: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True
    )

    deadline: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=True
    )

    progress: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        server_default=text("0")
    )
    budget: Mapped[float | None] = mapped_column(
    Numeric(12, 2),
    nullable=True
)

    expected_impact: Mapped[int | None] = mapped_column(
    Integer,
    nullable=True
  )

    prototype_name: Mapped[str | None] = mapped_column(
    Text,
    nullable=True
)

    prototype_url: Mapped[str | None] = mapped_column(
    Text,
    nullable=True
)
    created_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=True
    )

    updated_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=True
    )