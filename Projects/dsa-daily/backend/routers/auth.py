from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=schemas.Token)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if username already taken
    existing_user = db.query(models.User).filter(
        (models.User.username == user_data.username) | (models.User.email == user_data.email)
    ).first()
    if existing_user:
        if existing_user.username == user_data.username:
            raise HTTPException(status_code=400, detail="Username already registered")
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = get_password_hash(user_data.password)
    user = models.User(
        username=user_data.username,
        email=user_data.email,
        password_hash=hashed,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return schemas.Token(
        access_token=token,
        token_type="bearer",
        user=schemas.UserOut.model_validate(user),
    )


@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token({"sub": str(user.id)})
    return schemas.Token(
        access_token=token,
        token_type="bearer",
        user=schemas.UserOut.model_validate(user),
    )
