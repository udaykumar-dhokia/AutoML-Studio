from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()

class Settings(BaseSettings):
    MONGODB_URL: str
    PORT: int
    JWT_SECRET: str
    JWT_ALGORITHM: str
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    UPSTASH_URL: str
    UPSTASH_TOKEN: str

    class Config:
        env_file = ".env"

settings = Settings()
