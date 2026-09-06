import uuid
from datetime import datetime
from decimal import Decimal

from pgvector.sqlalchemy import Vector
from sqlalchemy import Text, Integer, DateTime, Numeric, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Problem(Base):
    __tablename__ = "problems"

    id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    server_default=text("gen_random_uuid()")
)

    citizen_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey("users.id")
)

    title: Mapped[str] = mapped_column(Text)

    description: Mapped[str] = mapped_column(Text)

    district: Mapped[str] = mapped_column(Text)

    category: Mapped[str] = mapped_column(Text)

    severity_score: Mapped[int] = mapped_column(Integer)

    embedding: Mapped[list[float] | None] = mapped_column(
    Vector(768),
    nullable=True
)

    status: Mapped[str] = mapped_column(
    Text,
    server_default=text("'Pending'")
)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True)
    )

    latitude: Mapped[Decimal] = mapped_column(Numeric)

    longitude: Mapped[Decimal] = mapped_column(Numeric)

    image_url: Mapped[str] = mapped_column(Text)

    video_url: Mapped[str] = mapped_column(Text)