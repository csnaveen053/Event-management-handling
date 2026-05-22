from sqlalchemy import Column, Date, Integer, String

from database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(String, nullable=True)
    date = Column(Date, nullable=False)
