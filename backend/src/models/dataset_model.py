from pydantic import BaseModel, Field
from typing import Optional, Annotated, List, Dict, Any
from bson.objectid import ObjectId
from pydantic import BeforeValidator
from enum import Enum
PyObjectId = Annotated[str, BeforeValidator(str)]

class PandasAnalysisResult(BaseModel):
    num_rows: Optional[int] = None
    num_columns: Optional[int] = None
    column_names: Optional[List[str]] = None
    column_types: Optional[Dict[str, str]] = None
    descriptive_statistics: Optional[Dict[str, Dict[str, Any]]] = None
    missing_values: Optional[Dict[str, int]] = None

class BasicAnalysisStatus(str, Enum):
    PENDING = "Pending"
    PROCESSING = "Processing"
    SUCCESS = "Success"

class Dataset(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: str
    description: Optional[str] = None
    url: str
    d_id: Optional[PyObjectId] = Field(default=None, alias="_d_id")
    user_id: Optional[PyObjectId] = Field(default=None, alias="_user_id")
    basic_analysis: BasicAnalysisStatus = BasicAnalysisStatus.PENDING
    basic_analysis_result: Optional[PandasAnalysisResult] = None
    

    class Config:
        populate_by_name = True
        json_encoders = {
            PyObjectId: str
        }
        

class DatasetRegister(BaseModel):
    name: str
    description: Optional[str] = None