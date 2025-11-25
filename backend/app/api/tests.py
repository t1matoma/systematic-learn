from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.test_service import TestService
from app.schemas.test import UserAnswers, TestResult

router = APIRouter(prefix="/tasks", tags=["tests"])

@router.post("/{task_id}/generate_test")
def generate_test(task_id: int, db: Session = Depends(get_db)):
    service = TestService(db)
    return service.generate_test(task_id)

@router.post("/{task_id}/check_answers", response_model=TestResult)
def check_answers(
    task_id: int,
    payload: UserAnswers,
    db: Session = Depends(get_db)
):
    service = TestService(db)
    return service.check_answers(task_id, payload)