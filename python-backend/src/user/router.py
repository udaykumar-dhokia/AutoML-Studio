from fastapi import APIRouter, Request, status
from .service import UserService
from fastapi.responses import JSONResponse
from src.models.user_model import User

router = APIRouter()
user = UserService()

@router.get("/")
async def get_user(request: Request):
    middleware_data = request.state.user_id
    
    curr_user = user.get_user_by_id(middleware_data["user_id"])
    if not curr_user:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"message": "User not found"})
    
    return {"user": User(**curr_user)}