from sqlalchemy.orm import Session
from app.repositories.task_repository import TaskRepository
from app.repositories.step_repository import StepRepository
from app.repositories.roadmap_repository import RoadmapRepository
from app.utils.ai_generator import AIGenerator
from app.utils.parsers import TaskParser
from app.models.task import Task
from typing import List
from fastapi import HTTPException

class TaskService:
    def __init__(self, db: Session):
        self.db = db
        self.task_repo = TaskRepository(db)
        self.step_repo = StepRepository(db)
        self.roadmap_repo = RoadmapRepository(db)
        self.ai_generator = AIGenerator()
        self.parser = TaskParser()
    
    def get_tasks_by_step(self, step_id: int) -> List[Task]:
        return self.task_repo.get_by_step_id(step_id)
    
    def create_tasks_for_step(self, step_id: int) -> List[Task]:
        step = self.step_repo.get_by_id(step_id)
        if not step:
            raise HTTPException(status_code=404, detail="Step not found")
        
        raw_text = self.ai_generator.generate_tasks(step.title)
        
        parsed_tasks = self.parser.parse_weeks(raw_text)
        
        tasks_data = [
            {**task, "step_id": step_id, "is_done": False}
            for task in parsed_tasks
        ]
        
        return self.task_repo.create_many(tasks_data)
    
    def toggle_task(self, task_id: int) -> Task:
        task = self.task_repo.toggle_status(task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        if task.is_done:
            self.roadmap_repo.increase_percentage(self.task_repo.get_roadmap_id(task_id))
        else:
            self.roadmap_repo.reduce_percentage(self.task_repo.get_roadmap_id(task_id))
        
        return task