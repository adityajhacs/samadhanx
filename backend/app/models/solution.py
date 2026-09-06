import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import Text, DateTime, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Solution(Base):
    __tablename__ = "solutions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True
    )

    problem_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("problems.id")
    )

    university_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("universities.id")
    )

    solution_title: Mapped[str] = mapped_column(Text)

    prototype_status: Mapped[str] = mapped_column(Text)

    estimated_cost: Mapped[Decimal] = mapped_column(Numeric)

    funding_received: Mapped[Decimal] = mapped_column(Numeric)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True)
    )