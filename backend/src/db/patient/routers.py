from fastapi import APIRouter, status, Depends
from .schemas import PatientAddModel, InPatientModel, OutPatientModel, ExaminationModel, TreatmentResponseModel, PatientAddModelExisted, PatientSearchModel, PatientModel, ExaminationAddModel, AdmissionAddModel
from .service import PatientService
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.auth.dependencies import AccessTokenBearer
from ..main import get_session
from fastapi.exceptions import HTTPException
from src.utils import handle_database_exception 

patient_router = APIRouter()
patient_service = PatientService()
access_token_bearer = AccessTokenBearer()

@patient_router.post('/add_new_patient',response_model=InPatientModel|OutPatientModel,status_code=status.HTTP_201_CREATED)
async def create_patient(
    patient_data:PatientAddModel,
    session:AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)
): 
    # can not check exists or not 
    try: 
        new_user = await patient_service.create_new_patient(patient_data,session)
        if new_user:
            return new_user
    except Exception as e: 
        await(handle_database_exception(session,"Invalid input",e))


@patient_router.post('/add_existed_patient', status_code=status.HTTP_202_ACCEPTED)
async def create_existed_patient(patient_data:PatientAddModelExisted,session:AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)):
    try:
        
        new_user = await patient_service.create_existed_patient(patient_data,session)
        
        if new_user:
            return new_user
    except Exception as e: 
        await(handle_database_exception(session,"Invalid pid",e))

@patient_router.post('/add_admission',status_code=status.HTTP_200_OK)
async def add_admission(admission_data:AdmissionAddModel, session:AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)):
    try: 
        new_admission = await patient_service.insert_admission(admission_data,session)
        if new_admission: 
            return new_admission
    except Exception as e: 
        await(handle_database_exception(session,"Can not add admission",e))

@patient_router.post('/add_examination',status_code=status.HTTP_200_OK)
async def add_examination(examination_data:ExaminationAddModel,session:AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)):
    try:
        new_examination = await patient_service.insert_examination(examination_data, session)
        if new_examination:
            return new_examination

    except Exception as e: 
        await(handle_database_exception(session,"Error with the server",e))


@patient_router.get('/id/{pid}')
async def get_patient(
    pid:int,
    session:AsyncSession = Depends(get_session),
    user_details=Depends(access_token_bearer)
):
    try: 
        patients = await patient_service.get_patient_by_id(pid,session)
        if patients:
            return patients
    except Exception as e: 
        print(f"Error occurred: {e}") 
        await(handle_database_exception(session,"Patient not found",e))

@patient_router.post('/search', response_model=list[PatientModel],status_code=status.HTTP_200_OK)
async def get_patients(
    search_data:PatientSearchModel,
    session:AsyncSession = Depends(get_session),
    user_details=Depends(access_token_bearer)
): 
    try: 
        patients = await patient_service.search_patient(search_data,session)
        if patients:
            return patients
    except Exception as e: 
        await(handle_database_exception(session,"Patient not found",e))

@patient_router.get('/name/{name}')
async def get_patients(
    name: str,
    session:AsyncSession = Depends(get_session),
    user_details=Depends(access_token_bearer)
): 
    patients = await patient_service.get_patient_by_name(name,session)
    return patients

@patient_router.get('/get_examination/{pid}', response_model=list[ExaminationModel])
async def get_examination(
    pid:int,
    session:AsyncSession = Depends(get_session),
    user_details=Depends(access_token_bearer)
):
    try: 
        examinations = await patient_service.find_examination_by_pid(pid,session)
        if examinations:
            return examinations
    except Exception as e:
        await(handle_database_exception(session,"No examinations found",e))

@patient_router.get('/get_treatment/{pid}',response_model=list[TreatmentResponseModel])
async def get_treatment(
    pid:int,
    session:AsyncSession = Depends(get_session),
    user_details=Depends(access_token_bearer)
):
    try: 
        treatments = await patient_service.find_treatment_by_pid(pid,session)
        if treatments:
            return treatments
    except Exception as e: 
        await(handle_database_exception(session,"No treatments found",e))


@patient_router.get('/medication_info/{pid}',response_model={})
async def get_medication_info(
    pid:int,
    session:AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)
):
    results = await patient_service.get_medication_info_by_pid(pid,session)
    return results


@patient_router.get('/type/{pid}',response_model={})
async def get_patient_type(
pid:int,
session:AsyncSession=Depends(get_session),
user_details=Depends(access_token_bearer)
):
    type = await patient_service.get_patient_type_byID(pid,session)
    if type: 
        return type
    return {"error": "No patient found"}


