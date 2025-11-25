from sqlalchemy.orm import Session
from app.repositories.task_repository import TaskRepository
from app.repositories.roadmap_repository import RoadmapRepository
from app.utils.ai_generator import AIGenerator
from app.schemas.test import UserAnswers, TestResult
from fastapi import HTTPException
from typing import Dict


active_tests: Dict[int, list] = {}

class TestService:
    def __init__(self, db: Session):
        self.db = db
        self.task_repo = TaskRepository(db)
        self.roadmap_repo = RoadmapRepository(db)
        self.ai_generator = AIGenerator()
    
    def generate_test(self, task_id: int) -> dict:
        task = self.task_repo.get_by_id(task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        quiz = self.ai_generator.generate_test(task.title)
        
        active_tests[task_id] = quiz
        
        return {
            "task_id": task_id,
            "quiz": quiz,
            "message": "Test generated successfully"
        }
    
    def check_answers(self, task_id: int, user_answers: UserAnswers) -> TestResult:
        if task_id not in active_tests:
            raise HTTPException(
                status_code=400,
                detail="No active test for this task. Generate test first."
            )
        
        quiz = active_tests[task_id]
        correct = 0
        detailed = []
        
        for q in quiz:
            qid = str(q["id"])
            right = q["right_answer"]
            user_answer = user_answers.answers.get(qid)
            
            is_correct = (user_answer == right)
            
            detailed.append({
                "question_id": qid,
                "question": q["question"],
                "user_answer": user_answer,
                "right_answer": right,
                "is_correct": is_correct
            })
            
            if is_correct:
                correct += 1
        
        total = len(quiz)
        passed = correct >= total * 0.7
        
        if passed:
            task = self.task_repo.mark_as_done(task_id)
            if task:
                if task.is_done:
                    self.roadmap_repo.increase_percentage(self.task_repo.get_roadmap_id(task_id))
                else:
                    self.roadmap_repo.reduce_percentage(self.task_repo.get_roadmap_id(task_id))
        
        
        del active_tests[task_id]
        
        return TestResult(
            task_id=task_id,
            total_questions=total,
            correct=correct,
            passed=passed,
            details=detailed
        )