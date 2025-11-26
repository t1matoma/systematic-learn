from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:2795@db:5432/learn_db"
    
    GEMINI_API_KEY: str

    CORS_ORIGINS: list = ["http://localhost:3000"]
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": False,  
        "extra": "ignore"  
    }

@lru_cache()
def get_settings():
    return Settings()