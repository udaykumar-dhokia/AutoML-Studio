from .. import redis
import pandas as pd
import json

QUEUE_NAME = "basic_analysis_queue"

async def process_task(task_data):
    try:
        task = json.loads(task_data)
        
        df = pd.read_csv(task["dataset_url"])
        
        print(f"Processing task: {task}")
    except Exception as e:
        print(f"Error processing task: {e}")

async def task_worker():
    print("Worker started...")
    while True:
        try:
            task_data = redis.redis.rpop(QUEUE_NAME)
            if task_data != None:
                await process_task(task_data)
        except Exception as e:
            print(f"Worker error: {e}") 
