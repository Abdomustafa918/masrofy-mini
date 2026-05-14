from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models import User
from app.schemas.user import UserCultureUpdate, UserRead

router = APIRouter(prefix="/users", tags=["users"])


@router.put("/me/culture", response_model=UserRead)
def update_culture(
    payload: UserCultureUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.preferred_culture = payload.preferred_culture
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user
