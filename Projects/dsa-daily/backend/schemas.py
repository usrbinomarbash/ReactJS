from datetime import datetime, date
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr


# ─── User Schemas ───────────────────────────────────────────────────────────

class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int
    xp: int
    level: int
    streak: int
    last_solved_date: Optional[date] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserLeaderboard(BaseModel):
    id: int
    username: str
    xp: int
    level: int
    streak: int

    model_config = {"from_attributes": True}


# ─── Auth Schemas ────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ─── Challenge Schemas ───────────────────────────────────────────────────────

class TestCase(BaseModel):
    input: str
    expected_output: str


class ChallengeBase(BaseModel):
    title: str
    description: str
    difficulty: str
    category: str
    test_cases: List[Any]
    date_assigned: date


class ChallengeOut(ChallengeBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class ChallengeList(BaseModel):
    id: int
    title: str
    difficulty: str
    category: str
    date_assigned: date
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Submission Schemas ──────────────────────────────────────────────────────

class SubmitRequest(BaseModel):
    challenge_id: int
    code: str


class TestResult(BaseModel):
    test_case: int
    passed: bool
    input: str
    expected: str
    got: Optional[str] = None
    error: Optional[str] = None


class SubmitResponse(BaseModel):
    passed: bool
    test_results: List[TestResult]
    xp_gained: int
    message: str


class SubmissionOut(BaseModel):
    id: int
    challenge_id: int
    challenge_title: Optional[str] = None
    challenge_difficulty: Optional[str] = None
    code: str
    passed: bool
    submitted_at: datetime

    model_config = {"from_attributes": True}
