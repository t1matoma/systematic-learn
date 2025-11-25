from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.services.task_service import TaskService
from app.schemas.task import STask

router = APIRouter(tags=["tasks"])

@router.get("/steps/{step_id}/tasks", response_model=List[STask])
def get_tasks(step_id: int, db: Session = Depends(get_db)):
    service = TaskService(db)
    return service.get_tasks_by_step(step_id)

@router.post("/steps/{step_id}/tasks", response_model=List[STask])
def create_tasks(step_id: int, db: Session = Depends(get_db)):
    service = TaskService(db)
    return service.create_tasks_for_step(step_id)

@router.patch("/tasks/{task_id}/toggle", response_model=STask)
def toggle_task(task_id: int, db: Session = Depends(get_db)):
    service = TaskService(db)
    return service.toggle_task(task_id)