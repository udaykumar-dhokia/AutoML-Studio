from fastapi import APIRouter, File, UploadFile, Request, Form
from ..models.dataset_model import DatasetRegister
from ..dataset.service import DatasetService
from typing import Optional

router = APIRouter()
dataset_service = DatasetService()


@router.post("/")
async def register_dataset(
    request: Request,
    name: str = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...)
):
    middleware_data = request.state.user_id
    
    dataset_data = DatasetRegister(name=name, description=description)
    
    await dataset_service.upload_dataset(dataset_data, file, middleware_data["user_id"])
    
    return {"message": "Dataset created successfully"}

@router.get("/")
async def get_datasets(request: Request):
    middleware_data = request.state.user_id
    
    return dataset_service.get_datasets(middleware_data["user_id"])