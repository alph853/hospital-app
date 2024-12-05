from fastapi import APIRouter, status, Depends
from .service import HospitalService
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.auth.dependencies import AccessTokenBearer
from ..main import get_session

hospital_router = APIRouter()
hospital_service = HospitalService()
access_token_bearer = AccessTokenBearer()

@hospital_router.get('/count')
async def count_doctor_nurse(session:AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)): 
    return await hospital_service.count_staff(session)

@hospital_router.get('/departments')
async def get_departments(session:AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)): 
    return await hospital_service.find_all_departments(session)