from collections import defaultdict
from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models import Budget, Transaction, User
from app.schemas.dashboard import DashboardSummary

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def dashboard_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    total_income = sum(tx.amount for tx in transactions if tx.type == "income")
    total_expenses = sum(tx.amount for tx in transactions if tx.type == "expense")
    balance = total_income - total_expenses
    savings = (balance / total_income * 100) if total_income else 0

    today = date.today()
    current_budget = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.month == today.month,
        Budget.year == today.year,
    ).first()
    budget_amount = current_budget.amount if current_budget else 0
    budget_spent = sum(tx.amount for tx in transactions if tx.type == "expense" and tx.transaction_date.month == today.month and tx.transaction_date.year == today.year)

    by_category = defaultdict(float)
    by_month = defaultdict(lambda: {"income": 0.0, "expenses": 0.0})
    for tx in transactions:
        if tx.type == "expense":
            by_category[tx.category] += tx.amount
            by_month[tx.transaction_date.strftime("%b").lower()]["expenses"] += tx.amount
        else:
            by_month[tx.transaction_date.strftime("%b").lower()]["income"] += tx.amount

    recent = sorted(transactions, key=lambda item: (item.transaction_date, item.id), reverse=True)[:6]

    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "balance": balance,
        "savings": savings,
        "budget_amount": budget_amount,
        "budget_spent": budget_spent,
        "budget_remaining": max(budget_amount - budget_spent, 0),
        "expenses_by_category": [{"category": key, "value": value} for key, value in by_category.items()],
        "monthly_income_vs_expenses": [
            {"month": month, "income": values["income"], "expenses": values["expenses"]}
            for month, values in sorted(by_month.items())
        ],
        "recent_transactions": recent,
    }
