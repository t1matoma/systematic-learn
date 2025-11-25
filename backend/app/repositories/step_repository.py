from sqlalchemy.orm import Session
from app.models.step import Step
from typing import List, Optional

class StepRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_roadmap_id(self, roadmap_id: int) -> List[Step]:
        return self.db.query(Step).filter(Step.roadmap_id == roadmap_id).all()
    
    def get_by_id(self, step_id: int) -> Optional[Step]:
        return self.db.query(Step).filter(Step.id == step_id).first()
    
    def create_many(self, steps_data: List[dict]) -> List[Step]:
        steps = [Step(**data) for data in steps_data]
        self.db.add_all(steps)
        self.db.commit()
        for step in steps:
            self.db.refresh(step)
        return steps