from fastapi import APIRouter, status, Response
from .service import AuthService
from ..models.user_model import UserRegister, UserLogin
from ..utils.jwt import JWT
from fastapi.responses import JSONResponse

router = APIRouter()
auth = AuthService()

@router.post("/register/", status_code=status.HTTP_201_CREATED)
async def register(user: UserRegister, response: Response):
    exists = auth.get_user_by_email(user.email)
    if exists:
        return JSONResponse(status_code=status.HTTP_409_CONFLICT, content={"message": "User already exists"})
    
    user_id = auth.register(user)
    
    token = JWT().encode({"user_id": str(user_id)})
    
    response.set_cookie(key="token", value=token)
    
    return {"message": "Registered successfully"}

@router.post("/login/", status_code=status.HTTP_200_OK)
async def login(user: UserLogin, response: Response):
    user: User = auth.login(user)
    if not user:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Invalid credentials"})
    
    token = JWT().encode({"user_id": user.id})
    
    print(token)
    
    response.set_cookie(key="token", value=token)
    
    return {"message": "Login successful"}