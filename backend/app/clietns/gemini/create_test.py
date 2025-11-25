from google import genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

def create_test(topic: str):
    client = genai.Client(api_key=os.getenv("GEMINI_API"))

    prompt = f"""
You are an assistant that generates JSON-structured quizzes.

Create a quiz of **5 multiple-choice questions** on the topic: "{topic}".

Each question must follow this JSON format:

{{
  "id": number,
  "question": "string",
  "options": ["A", "B", "C", "D"],
  "right_answer": "A or B or C or D, Just the letter of the correct option and nothing else"
}}

Important:
- Return ONLY valid JSON (no markdown!!!)
- "right_answer" MUST match exactly one of the options
- Options must be diverse and not trivial
- Questions must be theoretical (not coding)
- No explanation, only JSON
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    cleaned = response.text.strip()

    # remove markdown blocks if they appear
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]

    # validate JSON before returning
    try:
        data = json.loads(cleaned)
        return data
    except json.JSONDecodeError:
        print("Error: Gemini returned invalid JSON:")
        print(cleaned)
        raise
