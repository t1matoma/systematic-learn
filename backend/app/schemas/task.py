from pydantic import BaseModel, ConfigDict
from typing import Optional

class TaskBase(BaseModel):
    title: str
    body: str
    is_done: Optional[bool] = False
    
    step_id: int
    
class STask(TaskBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
    

class TaskCreate(TaskBase):
    pass