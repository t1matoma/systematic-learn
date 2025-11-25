from google import genai
from app.config import get_settings
import json

settings = get_settings()

class AIGenerator:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
    
    def generate_roadmap(self, topic: str) -> dict:
        prompt = f"""
        Create a learning roadmap for: "{topic}"
        
        Return ONLY a JSON object with this exact structure:
        {{
          "1": "Step 1 name",
          "2": "Step 2 name",
          "3": "Step 3 name",
          "4": "Step 4 name",
          "5": "Step 5 name"
        }}
        
        Rules:
        - Exactly 5 steps
        - Progress from beginner to advanced
        - Each step should be a clear learning milestone
        - No markdown, no explanations, ONLY JSON
        
        Example for "Web Development":
        {{
          "1": "HTML & CSS Fundamentals",
          "2": "JavaScript Basics",
          "3": "Frontend Framework (React)",
          "4": "Backend Development (Node.js)",
          "5": "Full-Stack Project"
        }}
        """
        
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        cleaned = response.text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        
        return json.loads(cleaned.strip())
    
    def generate_tasks(self, step_title: str) -> str:
        prompt = f"""
        Create a 4-week learning plan ONLY for: "{step_title}"
        
        Format EXACTLY like this:
        
        **Week 1: [Topic Name]**
        - Task 1: [Specific actionable task]
        - Task 2: [Specific actionable task]
        - Task 3: [Specific actionable task]
        
        **Week 2: [Topic Name]**
        - Task 1: [Specific actionable task]
        - Task 2: [Specific actionable task]
        - Task 3: [Specific actionable task]
        
        **Week 3: [Topic Name]**
        - Task 1: [Specific actionable task]
        - Task 2: [Specific actionable task]
        - Task 3: [Specific actionable task]
        
        **Week 4: [Topic Name]**
        - Task 1: [Specific actionable task]
        - Task 2: [Specific actionable task]
        - Task 3: [Specific actionable task]
        
        CRITICAL RULES:
        1. EXACTLY 4 weeks, no more, no less
        2. ONLY for topic: "{step_title}"
        3. Each week has 3 tasks
        4. Tasks are practical and hands-on
        5. NO other topics or steps
        6. NO intro text before Week 1
        7. NO conclusion after Week 4
        """
        
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        return response.text
    
    def generate_test(self, topic: str) -> list[dict]:
        prompt = f"""
        Generate a quiz of 5 multiple-choice questions on: "{topic}"
        
        Return ONLY valid JSON (no markdown):
        [
          {{
            "id": 1,
            "question": "Question text",
            "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
            "right_answer": "A"
          }}
        ]
        
        Rules:
        - Exactly 5 questions
        - 4 options per question (A, B, C, D)
        - right_answer is ONLY the letter (A, B, C, or D)
        - Questions are theoretical, not coding
        - Options are diverse and not trivial
        - NO markdown, ONLY JSON
        """
        
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        
        cleaned = response.text.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        
        return json.loads(cleaned.strip())