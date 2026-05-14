from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models import Budget, Transaction, User
from app.schemas.budget import BudgetCreate, BudgetRead, BudgetUpdate

router = APIRouter(prefix="/budgets", tags=["budgets"])


def get_user_budget(db: Session, user_id: int, budget_id: int) -> Budget:
    budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == user_id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget


@router.get("", response_model=list[BudgetRead])
def list_budgets(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Budget).filter(Budget.user_id == current_user.id).order_by(Budget.year.desc(), Budget.month.desc()).all()


@router.get("/current")
def current_budget(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    today = date.today()
    budget = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.month == today.month,
        Budget.year == today.year,
    ).first()
    start = date(today.year, today.month, 1)
    end = date(today.year + int(today.month == 12), 1 if today.month == 12 else today.month + 1, 1)
    spent = sum(row.amount for row in db.query(Transaction).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        Transaction.transaction_date >= start,
        Transaction.transaction_date < end,
    ).all())
    amount = budget.amount if budget else 0
    return {
        "budget": {
            "id": budget.id,
            "user_id": budget.user_id,
            "month": budget.month,
            "year": budget.year,
            "amount": budget.amount,
            "created_at": budget.created_at,
            "updated_at": budget.updated_at,
        } if budget else None,
        "spent": spent,
        "remaining": max(amount - spent, 0),
    }


@router.post("", response_model=BudgetRead, status_code=status.HTTP_201_CREATED)
def create_budget(payload: BudgetCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.month == payload.month,
        Budget.year == payload.year,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Budget already exists for this month")
    budget = Budget(user_id=current_user.id, **payload.model_dump())
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


@router.put("/{budget_id}", response_model=BudgetRead)
def update_budget(budget_id: int, payload: BudgetUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    conflict = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.month == payload.month,
        Budget.year == payload.year,
        Budget.id != budget_id,
    ).first()
    if conflict:
        raise HTTPException(status_code=409, detail="Budget already exists for this month")
    budget = get_user_budget(db, current_user.id, budget_id)
    for key, value in payload.model_dump().items():
        setattr(budget, key, value)
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(budget_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    budget = get_user_budget(db, current_user.id, budget_id)
    db.delete(budget)
    db.commit()
