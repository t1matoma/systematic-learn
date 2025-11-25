from sqlalchemy.orm import Session
from app.models.roadmap import Roadmap
from typing import List, Optional

class RoadmapRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self) -> List[Roadmap]:
        return self.db.query(Roadmap).all()
    
    def get_by_id(self, roadmap_id: int) -> Optional[Roadmap]:
        return self.db.query(Roadmap).filter(Roadmap.id == roadmap_id).first()
    
    def create(self, title: str, percentage: float = 0.0) -> Roadmap:
        roadmap = Roadmap(title=title, percentage=percentage)
        self.db.add(roadmap)
        self.db.commit()
        self.db.refresh(roadmap)
        return roadmap
    
    def update_percentage(self, roadmap_id: int, percentage: float) -> Optional[Roadmap]:
        roadmap = self.get_by_id(roadmap_id)
        if roadmap:
            roadmap.percentage = min(max(percentage, 0), 100)
            self.db.commit()
            self.db.refresh(roadmap)
        return roadmap
    
    def increase_percentage(self, roadmap_id: int)-> Optional[Roadmap]:
        roadmap = self.get_by_id(roadmap_id)
        if roadmap:
            roadmap.percentage = min(100.0, roadmap.percentage + 2.5)
            self.db.commit()
            self.db.refresh(roadmap)
        return roadmap
    
    def reduce_percentage(self, roadmap_id: int) -> Optional[Roadmap]:
        roadmap = self.get_by_id(roadmap_id)
        if roadmap:
            roadmap.percentage = max(0, roadmap.percentage - 2.5)
            self.db.commit()
            self.db.refresh(roadmap)
        return roadmap
        