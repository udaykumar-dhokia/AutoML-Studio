from pydantic import BaseModel
from typing import Optional, Annotated
from pydantic import Field, BeforeValidator
from bson.objectid import ObjectId

PyObjectId = Annotated[str, BeforeValidator(str)]

class User(BaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    username: str
    first_name: str
    last_name: str
    email: str
    password: str

    class Config:
        populate_by_name = True
        json_encoders = {
            PyObjectId: str
        }
        
class UserRegister(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str