from fastapi import FastAPI

from app.api.v1.router import api_router
from app.core.database import Base, engine
from sqlalchemy import text

with engine.connect() as connection:
    connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
    connection.commit()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Financial Intelligence System",
    version="1.0.0",
)

app.include_router(api_router)


@app.get("/")
async def root():
    return {"message": "Financial Intelligence System"}