from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.common import TransactionType


class CategoryBase(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    type: TransactionType
    culture_code: str | None = Field(default=None, max_length=12)


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    id: int
    user_id: int | None
    is_default: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
