from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_read_roadmaps():
    response = client.get("/roadmaps")
    assert response.status_code == 200
    

def test_add_roadmap():
    response = client.post("/roadmaps", params={"message": "DevOps engineer"})
    assert response.status_code == 200
    assert response.json()["title"] == "DevOps engineer"
    
    
def test_read_tasks():
    response = client.get("/roadmaps/1/tasks")
    assert response.status_code == 200


def test_add_task():
    response = client.post("/roadmaps/1/tasks")
    assert response.status_code == 200