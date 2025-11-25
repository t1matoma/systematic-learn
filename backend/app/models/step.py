from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class Step(Base):
    __tablename__ = "steps"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id"))

