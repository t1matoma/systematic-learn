from sqlalchemy.orm import Session
from app.repositories.roadmap_repository import RoadmapRepository
from app.repositories.step_repository import StepRepository
from app.repositories.task_repository import TaskRepository
from app.utils.ai_generator import AIGenerator
from app.models.roadmap import Roadmap
from app.schemas.roadmap import RoadmapCreate
from typing import List

class RoadmapService:
    def __init__(self, db: Session):
        self.db = db
        self.roadmap_repo = RoadmapRepository(db)
        self.step_repo = StepRepository(db)
        self.ai_generator = AIGenerator()
    
    def get_all_roadmaps(self) -> List[Roadmap]:
        return self.roadmap_repo.get_all()
    
    def create_roadmap(self, message: str) -> Roadmap:
        roadmap_dict = self.ai_generator.generate_roadmap(message)
        
        roadmap = self.roadmap_repo.create(title=message, percentage=0.0)
        
        steps_data = [
            {"title": title, "roadmap_id": roadmap.id}
            for title in roadmap_dict.values()
        ]
        self.step_repo.create_many(steps_data)
        
        return roadmap