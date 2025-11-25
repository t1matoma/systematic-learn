from pydantic import BaseModel

class UserAnswers(BaseModel):
    answers: dict[str, str]

class TestResult(BaseModel):
    task_id: int
    total_questions: int
    correct: int
    passed: bool
    details: list[dict]