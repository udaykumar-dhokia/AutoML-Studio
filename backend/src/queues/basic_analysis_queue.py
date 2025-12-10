from .. import redis

import json

QUEUE_NAME = "basic_analysis_queue"

async def enqueue_task(data: dict):
    await redis.redis.lpush(QUEUE_NAME, json.dumps(data))
    return data