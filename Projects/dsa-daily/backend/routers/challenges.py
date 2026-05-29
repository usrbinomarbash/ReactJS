from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas

router = APIRouter(prefix="/challenges", tags=["challenges"])


@router.get("/today", response_model=schemas.ChallengeOut)
def get_today_challenge(db: Session = Depends(get_db)):
    today = date.today()
    challenge = db.query(models.Challenge).filter(
        models.Challenge.date_assigned == today
    ).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="No challenge assigned for today")
    return challenge


@router.get("", response_model=list[schemas.ChallengeList])
def get_all_challenges(
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Challenge)
    if category:
        query = query.filter(models.Challenge.category == category)
    if difficulty:
        query = query.filter(models.Challenge.difficulty == difficulty)
    return query.order_by(models.Challenge.date_assigned).all()


@router.get("/{challenge_id}", response_model=schemas.ChallengeOut)
def get_challenge(challenge_id: int, db: Session = Depends(get_db)):
    challenge = db.query(models.Challenge).filter(
        models.Challenge.id == challenge_id
    ).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge
