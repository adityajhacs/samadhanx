import uuid
from datetime import datetime

from sqlalchemy import Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class University(Base):
    __tablename__ = "universities"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True
    )

    name: Mapped[str] = mapped_column(Text)

    expertise_areas: Mapped[list[str]] = mapped_column(
        ARRAY(Text)
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True)
    )