from pydantic import BaseModel, Field
from typing import Optional, Annotated
from bson.objectid import ObjectId
from pydantic import BeforeValidator

PyObjectId = Annotated[str, BeforeValidator(str)]

class Dataset(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: str
    description: Optional[str] = None
    url: str
    d_id: Optional[PyObjectId] = Field(default=None, alias="_d_id")
    user_id: Optional[PyObjectId] = Field(default=None, alias="_user_id")
    
    class Config:
        populate_by_name = True
        json_encoders = {
            PyObjectId: str
        }
        

class DatasetRegister(BaseModel):
    name: str
    description: Optional[str] = None