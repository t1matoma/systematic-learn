from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.services.step_service import StepService
from app.schemas.step import SStep

router = APIRouter(prefix="/roadmaps", tags=["steps"])

@router.get("/{roadmap_id}/steps", response_model=List[SStep])
def get_steps(roadmap_id: int, db: Session = Depends(get_db)):
    service = StepService(db)
    return service.get_steps_by_roadmap(roadmap_id)