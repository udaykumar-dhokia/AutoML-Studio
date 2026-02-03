from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers.dataset import router as dataset_router
from .routers.train_test_split import router as train_test_split_router
from .routers.model import router as model_router

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
app.include_router(train_test_split_router, prefix="/api/train-test-split")
app.include_router(model_router, prefix="/api/model")
