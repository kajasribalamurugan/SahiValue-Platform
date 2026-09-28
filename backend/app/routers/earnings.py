from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.transaction import CollectorEarningsOut, TransactionOut
from app.utils.dependencies import get_current_collector

router = APIRouter(prefix="/api/collectors", tags=["Collector Earnings"])


@router.get("/me/earnings", response_model=CollectorEarningsOut)
def get_collector_earnings(
    db: Session = Depends(get_db),
    collector: User = Depends(get_current_collector)
):
    # Calculate earnings ONLY from completed backend transaction records
    transactions = db.query(Transaction).filter(Transaction.collector_id == collector.id).all()

    total_earnings = sum(t.final_amount for t in transactions)
    total_kg = sum(t.verified_weight for t in transactions)
    completed_count = len(transactions)

    return CollectorEarningsOut(
        total_verified_earnings=round(total_earnings, 2),
        total_verified_recycled_kg=round(total_kg, 2),
        completed_lots=completed_count,
        transactions=[TransactionOut.model_validate(t) for t in transactions]
    )
