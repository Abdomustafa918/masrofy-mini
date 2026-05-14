from pydantic import BaseModel
from app.schemas.transaction import TransactionRead


class CategoryTotal(BaseModel):
    category: str
    value: float


class MonthlyTotal(BaseModel):
    month: str
    income: float
    expenses: float


class DashboardSummary(BaseModel):
    total_income: float
    total_expenses: float
    balance: float
    savings: float
    budget_amount: float
    budget_spent: float
    budget_remaining: float
    expenses_by_category: list[CategoryTotal]
    monthly_income_vs_expenses: list[MonthlyTotal]
    recent_transactions: list[TransactionRead]
