from sqlalchemy.orm import Session
from app.models.task import Task
from app.models.step import Step
from app.models.roadmap import Roadmap
from typing import List, Optional

class TaskRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_step_id(self, step_id: int) -> List[Task]:
        return self.db.query(Task).filter(Task.step_id == step_id).all()
    
    def get_roadmap_id(self, task_id: int) -> int:
        step_id = self.db.query(Task).filter(Task.id == task_id).first().step_id
        roadmap_id = self.db.query(Step).filter(Step.id == step_id).first().roadmap_id
        
        return roadmap_id
    
    def get_by_id(self, task_id: int) -> Optional[Task]:
        return self.db.query(Task).filter(Task.id == task_id).first()
    
    def create_many(self, tasks_data: List[dict]) -> List[Task]:
        tasks = [Task(**data) for data in tasks_data]
        self.db.add_all(tasks)
        self.db.commit()
        for task in tasks:
            self.db.refresh(task)
        return tasks
    
    def toggle_status(self, task_id: int) -> Optional[Task]:
        task = self.get_by_id(task_id)
        if task:
            task.is_done = not task.is_done
            self.db.commit()
            self.db.refresh(task)
        return task
    
    def get_status(self, task_id: int) -> Optional[Task]:
        task = self.get_by_id(task_id)
        return task.is_done
    
    def mark_as_done(self, task_id: int) -> Optional[Task]:
        task = self.get_by_id(task_id)
        if task and not task.is_done:
            task.is_done = True
            self.db.commit()
            self.db.refresh(task)
        return task
    
    def count_by_roadmap(self, roadmap_id: int) -> tuple[int, int]:
        """Returns (total_tasks, done_tasks) for a roadmap"""
        total = self.db.query(Task).join(Step).filter(
            Step.roadmap_id == roadmap_id
        ).count()
        
        done = self.db.query(Task).join(Step).filter(
            Step.roadmap_id == roadmap_id,
            Task.is_done == True
        ).count()
        
        return total, done