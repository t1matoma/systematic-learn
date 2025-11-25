from sqlalchemy import Column, Integer, String, JSON, Float
from app.database import Base

class Roadmap(Base):
    __tablename__ = "roadmaps"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    percentage = Column(Float)

    