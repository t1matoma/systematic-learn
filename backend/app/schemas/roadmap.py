from pydantic import BaseModel, ConfigDict
class RoadmapCreate(BaseModel):
    title: str

class SRoadmap(BaseModel):
    id: int
    title: str
    percentage: float

    model_config = ConfigDict(from_attributes=True)
    
