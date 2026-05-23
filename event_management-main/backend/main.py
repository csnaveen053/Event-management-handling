import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import events

_DEFAULT_ORIGINS = "http://localhost:5173,https://event-management-handling.vercel.app"


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Event Management API", lifespan=lifespan)

# Ensure tables exist when running without lifespan (e.g. some test clients)
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        o.strip()
        for o in os.getenv("ALLOWED_ORIGINS", _DEFAULT_ORIGINS).split(",")
        if o.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router)


@app.get("/")
def root():
    return {"message": "Event Management API"}
