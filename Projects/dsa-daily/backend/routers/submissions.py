import traceback
from datetime import date, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(tags=["submissions"])

XP_REWARDS = {
    "easy": 10,
    "medium": 20,
    "hard": 30,
}


def run_tests(code: str, test_cases: list) -> tuple[bool, list[schemas.TestResult]]:
    """Execute user code against all test cases and return (all_passed, results)."""
    results: list[schemas.TestResult] = []

    for idx, tc in enumerate(test_cases):
        input_str = tc.get("input", "")
        expected = str(tc.get("expected_output", ""))
        local_ns: dict = {}
        try:
            exec(compile(code, "<string>", "exec"), local_ns)  # noqa: S102
            if "solution" not in local_ns:
                results.append(schemas.TestResult(
                    test_case=idx + 1,
                    passed=False,
                    input=input_str,
                    expected=expected,
                    error="No function named 'solution' found in submitted code.",
                ))
                continue

            args = eval(f"({input_str},)", {}, {})  # noqa: S307
            result = local_ns["solution"](*args)
            got = str(result)
            passed = got == expected
            results.append(schemas.TestResult(
                test_case=idx + 1,
                passed=passed,
                input=input_str,
                expected=expected,
                got=got,
            ))
        except SyntaxError as exc:
            results.append(schemas.TestResult(
                test_case=idx + 1,
                passed=False,
                input=input_str,
                expected=expected,
                error=f"SyntaxError: {exc}",
            ))
        except Exception:
            results.append(schemas.TestResult(
                test_case=idx + 1,
                passed=False,
                input=input_str,
                expected=expected,
                error=traceback.format_exc(limit=5),
            ))

    all_passed = all(r.passed for r in results)
    return all_passed, results


def update_streak(user: models.User, today: date) -> None:
    """Update user streak based on last_solved_date."""
    from datetime import timedelta
    yesterday = today - timedelta(days=1)
    if user.last_solved_date is None or user.last_solved_date < yesterday:
        user.streak = 1
    elif user.last_solved_date == yesterday:
        user.streak += 1
    # If last_solved_date == today, streak stays the same
    user.last_solved_date = today


@router.post("/submit", response_model=schemas.SubmitResponse)
def submit_solution(
    payload: schemas.SubmitRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    challenge = db.query(models.Challenge).filter(
        models.Challenge.id == payload.challenge_id
    ).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")

    # Run test cases
    all_passed, test_results = run_tests(payload.code, challenge.test_cases)

    # Determine XP gain — only award XP if user hasn't already passed this challenge
    xp_gained = 0
    if all_passed:
        already_passed = db.query(models.Submission).filter(
            models.Submission.user_id == current_user.id,
            models.Submission.challenge_id == challenge.id,
            models.Submission.passed == True,  # noqa: E712
        ).first()
        if not already_passed:
            difficulty_key = str(challenge.difficulty.value if hasattr(challenge.difficulty, "value") else challenge.difficulty)
            xp_gained = XP_REWARDS.get(difficulty_key, 10)
            current_user.xp += xp_gained
            current_user.level = (current_user.xp // 100) + 1
            today = date.today()
            update_streak(current_user, today)

    # Save submission
    submission = models.Submission(
        user_id=current_user.id,
        challenge_id=challenge.id,
        code=payload.code,
        passed=all_passed,
    )
    db.add(submission)
    db.commit()
    db.refresh(current_user)

    if all_passed:
        msg = f"All tests passed! You earned {xp_gained} XP." if xp_gained > 0 else "All tests passed! (XP already awarded for this challenge)"
    else:
        failed = sum(1 for r in test_results if not r.passed)
        msg = f"{failed} of {len(test_results)} test(s) failed."

    return schemas.SubmitResponse(
        passed=all_passed,
        test_results=test_results,
        xp_gained=xp_gained,
        message=msg,
    )


@router.get("/submissions/history", response_model=list[schemas.SubmissionOut])
def get_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    submissions = (
        db.query(models.Submission)
        .filter(models.Submission.user_id == current_user.id)
        .order_by(models.Submission.submitted_at.desc())
        .all()
    )
    result = []
    for s in submissions:
        diff = str(s.challenge.difficulty.value if hasattr(s.challenge.difficulty, "value") else s.challenge.difficulty)
        result.append(schemas.SubmissionOut(
            id=s.id,
            challenge_id=s.challenge_id,
            challenge_title=s.challenge.title,
            challenge_difficulty=diff,
            code=s.code,
            passed=s.passed,
            submitted_at=s.submitted_at,
        ))
    return result


@router.get("/submissions/history/{challenge_id}", response_model=list[schemas.SubmissionOut])
def get_challenge_history(
    challenge_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    submissions = (
        db.query(models.Submission)
        .filter(
            models.Submission.user_id == current_user.id,
            models.Submission.challenge_id == challenge_id,
        )
        .order_by(models.Submission.submitted_at.desc())
        .all()
    )
    result = []
    for s in submissions:
        diff = str(s.challenge.difficulty.value if hasattr(s.challenge.difficulty, "value") else s.challenge.difficulty)
        result.append(schemas.SubmissionOut(
            id=s.id,
            challenge_id=s.challenge_id,
            challenge_title=s.challenge.title,
            challenge_difficulty=diff,
            code=s.code,
            passed=s.passed,
            submitted_at=s.submitted_at,
        ))
    return result
