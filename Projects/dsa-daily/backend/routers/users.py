from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@router.get("/leaderboard", response_model=list[schemas.UserLeaderboard])
def get_leaderboard(db: Session = Depends(get_db)):
    users = (
        db.query(models.User)
        .order_by(models.User.xp.desc())
        .limit(20)
        .all()
    )
    return users
