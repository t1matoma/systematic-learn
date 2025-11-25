from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres123@db:5432/roadmap_db"
    
    # Gemini API (изменено на UPPERCASE)
    GEMINI_API_KEY: str
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000"]
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": False,  # Разрешить любой регистр
        "extra": "ignore"  # Игнорировать лишние поля
    }

@lru_cache()
def get_settings():
    return Settings()