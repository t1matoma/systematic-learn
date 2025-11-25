from sqlalchemy.orm import Session
from app.repositories.step_repository import StepRepository
from app.models.step import Step
from typing import List

class StepService:
    def __init__(self, db: Session):
        self.db = db
        self.step_repo = StepRepository(db)
    
    def get_steps_by_roadmap(self, roadmap_id: int) -> List[Step]:
        return self.step_repo.get_by_roadmap_id(roadmap_id)