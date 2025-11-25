from pydantic import BaseModel, ConfigDict

class BaseStep(BaseModel):
    title: str
    roadmap_id: int
    

class SStep(BaseStep):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
    
    
class StepCreate(BaseStep):
    pass