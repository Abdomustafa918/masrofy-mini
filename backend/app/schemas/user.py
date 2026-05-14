from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from app.schemas.common import CultureCode


class UserBase(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    preferred_culture: CultureCode = "en-US"


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=72)


class UserRead(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserCultureUpdate(BaseModel):
    preferred_culture: CultureCode
