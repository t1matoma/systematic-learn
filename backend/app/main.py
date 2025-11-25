from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import engine, Base
from app.api import roadmaps, steps, tasks, tests

Base.metadata.create_all(bind=engine)

settings = get_settings()

app = FastAPI(
    title="Learning Roadmap API",
    description="API for managing learning roadmaps with AI-generated content"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(roadmaps.router)
app.include_router(steps.router)
app.include_router(tasks.router)
app.include_router(tests.router)

@app.get("/")
def home():
    return {
        "message": "Learning Roadmap API",
        "docs": "/docs"
    }