from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .dataset.router import router as dataset_router

app = FastAPI()

origins = [
    "http://localhost:3000/api",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"message": "Server is running"}

app.include_router(dataset_router, prefix="/api/dataset")
