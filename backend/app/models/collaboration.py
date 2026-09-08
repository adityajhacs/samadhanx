import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import Text, TIMESTAMP, Numeric, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Collaboration(Base):
    __tablename__ = "collaborations"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()")
    )

    project_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("projects.id"),
        nullable=True
    )

    industry_partner_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("industry_partners.id"),
        nullable=True
    )

    collaboration_type: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    amount: Mapped[Decimal | None] = mapped_column(
        Numeric,
        nullable=True
    )

    status: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime | None] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=True
    )