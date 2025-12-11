from .config import settings
from pymongo import MongoClient

client: MongoClient | None = None
db = None

async def init_db():
    global client, db
    client = MongoClient(settings.MONGODB_URL)
    db = client["automl-studio-dev"]
    print("📦 MongoDB connected")

async def close_db():
    global client, db
    client.close()
    print("📦 MongoDB disconnected")