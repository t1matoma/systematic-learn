from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from app.database import Base

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    body = Column(String)
    is_done = Column(Boolean)
    
    step_id = Column(Integer, ForeignKey("steps.id"))
