from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

def create_tasks(step_title: str):
    client = genai.Client(api_key=os.getenv("GEMINI_API"))
    
    prompt = f"""
    Create a 4-week learning plan ONLY for this specific topic: "{step_title}"
    
    You must return EXACTLY 4 weeks, no more, no less.
    
    Format your response EXACTLY like this:
    
    **Week 1: [Descriptive Topic Name]**
    - Task 1: [Specific actionable task with clear instructions]
    - Task 2: [Specific actionable task with clear instructions]
    - Task 3: [Specific actionable task with clear instructions]
    
    **Week 2: [Descriptive Topic Name]**
    - Task 1: [Specific actionable task with clear instructions]
    - Task 2: [Specific actionable task with clear instructions]
    - Task 3: [Specific actionable task with clear instructions]
    
    **Week 3: [Descriptive Topic Name]**
    - Task 1: [Specific actionable task with clear instructions]
    - Task 2: [Specific actionable task with clear instructions]
    - Task 3: [Specific actionable task with clear instructions]
    
    **Week 4: [Descriptive Topic Name]**
    - Task 1: [Specific actionable task with clear instructions]
    - Task 2: [Specific actionable task with clear instructions]
    - Task 3: [Specific actionable task with clear instructions]
    
    IMPORTANT RULES:
    1. Create tasks ONLY for the topic: "{step_title}"
    2. Return EXACTLY 4 weeks, nothing more
    3. Each week should have 3 specific, actionable tasks
    4. Tasks should be practical and hands-on
    5. Progress from beginner to intermediate level
    6. Include both theory and practice
    7. For programming: include setup, basics, practice, and a small project
    8. DO NOT include other topics or steps
    9. DO NOT add any introductory text before Week 1
    10. DO NOT add any concluding text after Week 4
    
    Example for "Python Basics":
    
    **Week 1: Introduction to Python & Basic Syntax**
    - Task 1: Install Python 3.x and VS Code, set up your first Python file
    - Task 2: Learn variables, data types (int, float, str, bool), and practice with print() and input()
    - Task 3: Write programs using arithmetic operators and string manipulation
    
    **Week 2: Control Flow & Functions**
    - Task 1: Master if/elif/else statements and comparison operators
    - Task 2: Learn for and while loops, practice with range() and break/continue
    - Task 3: Create functions with parameters and return values, understand scope
    
    **Week 3: Data Structures**
    - Task 1: Work with lists (creation, indexing, slicing, methods like append, pop)
    - Task 2: Understand dictionaries, tuples, and sets with practical examples
    - Task 3: Practice nested data structures and list comprehensions
    
    **Week 4: File Handling & Mini Project**
    - Task 1: Learn to read from and write to text files using open(), read(), write()
    - Task 2: Handle exceptions with try/except blocks
    - Task 3: Build a mini project: Create a simple contact book that saves to a file
    
    Now create a similar 4-week plan for: "{step_title}"
    """
    
    response = client.models.generate_content(
        model="gemini-2.5-flash", 
        contents=prompt
    )
    
    return response.text