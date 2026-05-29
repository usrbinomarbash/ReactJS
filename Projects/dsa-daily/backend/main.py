from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine, Base
from routers import auth, challenges, submissions, users

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DSA Daily API",
    description="Backend API for the DSA Daily code challenge platform",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(challenges.router)
app.include_router(submissions.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {"message": "DSA Daily API is running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}
