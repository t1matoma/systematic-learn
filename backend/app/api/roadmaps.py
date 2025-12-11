from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.services.roadmap_service import RoadmapService
from app.schemas.roadmap import SRoadmap, RoadmapCreate

router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])

@router.get("", response_model=List[SRoadmap])
def get_roadmaps(db: Session = Depends(get_db)):
    service = RoadmapService(db)
    return service.get_all_roadmaps()

@router.post("", response_model=SRoadmap)
def create_roadmap(
    data: RoadmapCreate,
    db: Session = Depends(get_db)
):
    service = RoadmapService(db)
    return service.create_roadmap(data.title)