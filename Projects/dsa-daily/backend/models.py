import enum
from datetime import datetime, date
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Date, DateTime,
    ForeignKey, Enum as SAEnum, JSON, func
)
from sqlalchemy.orm import relationship
from database import Base


class DifficultyEnum(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"


class CategoryEnum(str, enum.Enum):
    arrays = "Arrays"
    linked_lists = "Linked Lists"
    stacks = "Stacks"
    queues = "Queues"
    trees = "Trees"
    graphs = "Graphs"
    sorting = "Sorting"
    hashing = "Hashing"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    xp = Column(Integer, default=0, nullable=False)
    level = Column(Integer, default=1, nullable=False)
    streak = Column(Integer, default=0, nullable=False)
    last_solved_date = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    submissions = relationship("Submission", back_populates="user")


class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(SAEnum(DifficultyEnum), nullable=False)
    category = Column(SAEnum(CategoryEnum), nullable=False)
    test_cases = Column(JSON, nullable=False)
    date_assigned = Column(Date, unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    submissions = relationship("Submission", back_populates="challenge")


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    code = Column(Text, nullable=False)
    passed = Column(Boolean, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="submissions")
    challenge = relationship("Challenge", back_populates="submissions")
