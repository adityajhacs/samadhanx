import uuid
from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import Text, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class University(Base):
    __tablename__ = "universities"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True
    )

    name: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    expertise_area: Mapped[list[str] | None] = mapped_column(
    "expertise_areas",
    ARRAY(Text),
    nullable=True
)
    district: Mapped[str | None] = mapped_column(
    Text,
    nullable=True
)

    department: Mapped[str | None] = mapped_column(
    Text,
    nullable=True
)

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False
    )

    embedding: Mapped[list[float] | None] = mapped_column(
        Vector(1536),
        nullable=True
    )