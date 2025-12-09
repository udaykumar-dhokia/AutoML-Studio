from .utils.jwt import JWT
from .database import init_db, close_db
from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from jwt import PyJWTError


from .auth.router import router as auth_router
from .user.router import router as user_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing services...")
    await init_db()
    yield
    print("Shutting down services...")
    await close_db()

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    public_routes = {"/", "/auth/login/", "/auth/register/", "/docs", "/openapi.json"}

    if request.url.path in public_routes:
        return await call_next(request)

    token = request.cookies.get("token")

    if not token:
        return JSONResponse(status_code=401, content={"message": "Missing token"})

    try:
        user = JWT().decode(token)
        request.state.user = user
    except PyJWTError:
        return JSONResponse(status_code=401, content={"message": "Invalid token"})

    return await call_next(request)

@app.get("/")
def health_check():
    return {"message": "Server is running"}

app.include_router(auth_router, prefix="/auth")
app.include_router(user_router, prefix="/user")
