from fastapi import File, UploadFile, HTTPException
import cloudinary.uploader
from ..cloudinary import cloudinary
from ..models.dataset_model import DatasetRegister, Dataset
from src import database

class DatasetService:
    
    def upload_dataset(self, dataset: DatasetRegister, file: UploadFile, user_id: str):
        try:
            result = cloudinary.uploader.upload(file.file, folder=f"AutoML Studio/{user_id}", resource_type="auto")
            
            dataset_dict = dataset.model_dump()
            dataset_dict["url"] = result.get("secure_url")
            dataset_dict["d_id"] = result.get("public_id")
            dataset_dict["user_id"] = user_id
            
            result = database.db.datasets.insert_one(dataset_dict)

            return Dataset(**dataset_dict)
        
        except Exception as e:
            print(e)
            raise HTTPException(status_code=400, detail=f"Upload failed: {e}")
        
    def get_datasets(self, user_id: str):
        try:
            datasets = database.db.datasets.find({"user_id": user_id})
            return [Dataset(**dataset) for dataset in datasets]
        except Exception as e:
            print(e)
            raise HTTPException(status_code=400, detail=f"Get datasets failed: {e}")