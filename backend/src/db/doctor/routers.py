from fastapi import APIRouter, Depends
from .schemas import DoctorResponseModel, PatientTreatmentResponse, DoctorSearchModel
from sqlmodel.ext.asyncio.session import AsyncSession
from ..main import get_session
from .service import DoctorService
from src.db.auth.dependencies import AccessTokenBearer
from src.utils import handle_database_exception 

doctor_router = APIRouter()
doctor_service = DoctorService()
access_token_bearer = AccessTokenBearer()


@doctor_router.get('/',response_model=list[DoctorResponseModel])
async def find_all_doctors(
    session: AsyncSession = Depends(get_session),
    user_details=Depends(access_token_bearer)
):
    try: 
        print(user_details)
        doctors = await doctor_service.get_all_doctors(session)
        return doctors
    except Exception as e: 
        await(handle_database_exception(session,"Can not access database",e))


@doctor_router.get('/{ecode}', response_model=DoctorResponseModel|dict)
async def find_doctor_ecode(
    ecode:int,
    session: AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)
):
    try: 
        doctor = await doctor_service.get_doctor_by_id(ecode,session)
        if doctor: 
            return doctor
    except Exception as e: 
        await(handle_database_exception(session,"No patient found",e))
    

@doctor_router.get('/get_treated_patients/{ecode}',response_model=list)
async def find_treated_patients(
    ecode:int,
    session:AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)
):
    response = await doctor_service.get_treated_patients(ecode,session)
    return response


@doctor_router.post('/search',response_model=dict)
async def doctor_search(
    searchdata: DoctorSearchModel,
    session:AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)
):
    doctors = await doctor_service.doctor_search_name_code(searchdata,session)

    if doctors: 
        return {'doctors':doctors}
    
    return {'error': 'No doctor found'}

@doctor_router.get('/get_doctor_department/{dtitle}')
async def doctor_search_department(
    dtitle:str,
    session:AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)
): 
    res = await doctor_service.search_doctors_by_department(dtitle,session)
    if res: 
        return res
    return {'error':'No doctor found'}

@doctor_router.get('/get_nurse_department/{dtitle}')
async def doctor_search_department(
    dtitle:str,
    session:AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)
): 
    res = await doctor_service.search_nurses_by_department(dtitle,session)
    if res: 
        return res
    return {'error':'No doctor found'}

