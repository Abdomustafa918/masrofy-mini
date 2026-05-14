from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.common import TransactionType


class TransactionBase(BaseModel):
    amount: float = Field(gt=0)
    type: TransactionType
    category: str = Field(min_length=1, max_length=100)
    note: str | None = Field(default=None, max_length=500)
    transaction_date: date


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(TransactionBase):
    pass


class TransactionRead(TransactionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
