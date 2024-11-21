from fastapi import APIRouter, Depends
from .schemas import DoctorResponseModel, PatientTreatmentResponse
from sqlmodel.ext.asyncio.session import AsyncSession
from ..main import get_session
from fastapi.exceptions import HTTPException
from .service import DoctorService
from src.db.auth.dependencies import AccessTokenBearer

doctor_router = APIRouter()
doctor_service = DoctorService()
access_token_bearer = AccessTokenBearer()


@doctor_router.get('/',response_model=list[DoctorResponseModel])
async def find_all_doctors(
    session: AsyncSession = Depends(get_session),
    user_details=Depends(access_token_bearer)
):
    print(user_details)
    doctors = await doctor_service.get_all_doctors(session)
    return doctors

@doctor_router.get('/{ecode}', response_model=DoctorResponseModel|dict)
async def find_doctor_ecode(
    ecode:int,
    session: AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)
):
    doctor = await doctor_service.get_doctor_by_id(ecode,session)
    if doctor: 
        return doctor
    
    return {}

@doctor_router.get('/get_treated_patients/{ecode}',response_model=list)
async def find_treated_patients(
    ecode:int,
    session:AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)
):
    response = await doctor_service.get_treated_patients(ecode,session)
    return response
