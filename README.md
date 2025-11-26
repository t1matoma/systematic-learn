# Systematic Learn – Roadmap Learning Platform

Website for systematic learning and check knowledge.

##  Technology Stack
| Component       | Technology |
|-----------------|------------|
| Backend         | FastAPI |
| Database        | PostgreSQL |
| Frontend        | React |

##  Quick start(with Docker)


### Installation
```bash
# 1. Clone repository
git clone https://github.com/t1matoma/systematic-learn
cd systematic-learn

```

### Add .env

You need to create two .env files: one in the project root and one in the backend directory.

#### Create a file named .env in the root directory of the project and add:

```init
GEMINI_API_KEY="your_api_key"
```

#### Inside the backend folder, create another .env file and add:

```init
GEMINI_API_KEY="your_api_key"

DATABASE_URL="postgresql://postgres:postgres123@db:5432/roadmap_db"
```

### Build and start containers

```bash
docker-compose up --build
```


#### The app will be available at:

`http://localhost:3000/`

## How it works

On the home page, you can click the “Add Roadmap” button and enter an IT specialty (for example, Python Backend or DevOps).
After you press “Create”, Gemini generates a roadmap for this specialty.

Each roadmap contains 10 steps.
When you open a step, you can add tasks for it.
After completing a task, you can click “Create Test” to check your knowledge.

If you successfully pass the test, the roadmap’s completion percentage increases.