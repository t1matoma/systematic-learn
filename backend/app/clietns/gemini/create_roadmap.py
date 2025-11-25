from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

def create_roadmap(message):
    client = genai.Client(api_key=os.getenv("GEMINI_API"))
    
    prompt = f"""
    Create a comprehensive learning roadmap for a {message}. 
    Return the response ONLY as a valid JSON object with the following structure:
    {{
        "1 step": "specific learning topic or skill",
        "2 step": "specific learning topic or skill",
        "3 step": "specific learning topic or skill",
        ...
        "10 step": "specific learning topic or skill"
    }}
    
    Make sure:
    - Use exactly 10 steps and 1 step can have 1 technology whrite without description onl name like 1 step: Python, 2 step: OOP, 3 step: DB, etc.
    - Each step should be a clear, actionable learning objective
    - Steps should progress from foundational to advanced topics
    - Focus on practical skills relevant to {message}
    - Return ONLY the JSON, no additional text or explanations
    """
    
    response = client.models.generate_content(
        model="gemini-2.5-flash", 
        contents=prompt
    )
    
    cleaned_response = response.text.strip()
    if cleaned_response.startswith('```json'):
        cleaned_response = cleaned_response[7:]
    if cleaned_response.endswith('```'):
        cleaned_response = cleaned_response[:-3]
    
    return cleaned_response.strip()