from upstash_redis import Redis
from .config import settings

redis = None

async def init_redis():
    global redis
    redis = Redis(
        url=settings.UPSTASH_URL,
        token=settings.UPSTASH_TOKEN,
    )
    print("📦 Redis connected")
