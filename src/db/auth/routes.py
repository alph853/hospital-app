from passlib.context import CryptContext
from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from fastapi.responses import JSONResponse
from src.db.main import get_session
from datetime import timedelta, datetime
from sqlmodel.ext.asyncio.session import AsyncSession
from .schemas import UserLoginModel
from ...config import Config
from .utils import create_access_token, load_invalid_tokens, save_invalid_tokens, is_token_valid
from .dependencies import RefreshTokenBearer, AccessTokenBearer
pwd_context = CryptContext(
    schemes=['bcrypt']
)
auth_router = APIRouter()
REFRESH_TOKEN_EXPIRY = 2

@auth_router.post('/login')
async def login_user(login_data:UserLoginModel,session:AsyncSession = Depends(get_session)):
    email = login_data.email
    password = login_data.password
    print(email,password)
    if email == Config.USER_EMAIL: 
        pwd_valid = pwd_context.verify(password,Config.USER_PWD)
        print(pwd_valid)
        if pwd_valid: 
            access_token = create_access_token(
                user_data={
                    'email': email,
                }
            )
            refresh_token = create_access_token(
                user_data={
                    'email': email,
                },
                refresh=True,
                expiry= timedelta(days=REFRESH_TOKEN_EXPIRY)
            )

            return JSONResponse(
                content={
                    "message": "Log in successful",
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "user":{
                        "email": email
                    }
                }
            )
        else: 
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Wrong password")
    else: 
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Wrong email")


@auth_router.post('/refresh_token')
async def get_new_access_token(token_details:dict = Depends(RefreshTokenBearer)):
    expiry_timestamp = token_details['exp']
    if datetime.fromtimestamp(expiry_timestamp) > datetime.now():
        new_accress_token = create_access_token(
            user_data= token_details['user']
        )
        return JSONResponse(
            content={
                "access_token": new_accress_token
            }
        )
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Invalid or expired token")

@auth_router.get('/logout')
async def logout(token_details: dict = Depends(AccessTokenBearer())):
    jti = token_details['jti']
    invalid_tokens = load_invalid_tokens()
    
    
    invalid_tokens[jti] = True
    
    
    save_invalid_tokens(invalid_tokens)
    
    return JSONResponse(content={"message": "Logged out successfully"},status_code=status.HTTP_200_OK)
    