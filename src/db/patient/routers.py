from fastapi import APIRouter, status, Depends
from .schemas import PatientAddModel, InPatientModel, OutPatientModel, AdmissionModel, ExaminationModel, TreatmentResponseModel
from .service import PatientService
from sqlmodel.ext.asyncio.session import AsyncSession
from src.db.auth.dependencies import AccessTokenBearer
from ..main import get_session
from fastapi.exceptions import HTTPException

patient_router = APIRouter()
patient_service = PatientService()
access_token_bearer = AccessTokenBearer()

@patient_router.post('/',response_model=InPatientModel|AdmissionModel|OutPatientModel,status_code=status.HTTP_201_CREATED)
async def create_patient(
    patient_data:PatientAddModel,
    session:AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)
): 
    # can not check exists or not 
    new_user = await patient_service.create_patient(patient_data,session)
    if new_user:
        return new_user
    
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,detail="Wrong pid")

@patient_router.get('/{pid}')
async def get_patient(
    pid:int,
    session:AsyncSession = Depends(get_session),
    user_details=Depends(access_token_bearer)
):
    patients = await patient_service.get_patient_by_id(pid,session)
    if patients:
        return patients
    
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Patient not found")

@patient_router.get('/get_examination/{pid}', response_model=list[ExaminationModel])
async def get_examination(
    pid:int,
    session:AsyncSession = Depends(get_session),
    user_details=Depends(access_token_bearer)
):
    examinations = await patient_service.find_examination_by_pid(pid,session)
    if examinations:
        return examinations
    
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No examinations found")

@patient_router.get('/get_treatment/{pid}',response_model=list[TreatmentResponseModel])
async def get_treatment(
    pid:int,
    session:AsyncSession = Depends(get_session),
    user_details=Depends(access_token_bearer)
):
    treatments = await patient_service.find_treatment_by_pid(pid,session)
    if treatments:
        return treatments
    
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="No treatments found")

@patient_router.get('/medication_info/{pid}',response_model={})
async def get_medication_info(
    pid:int,
    session:AsyncSession=Depends(get_session),
    user_details=Depends(access_token_bearer)
):
    results = await patient_service.get_medication_info_by_pid(pid,session)
    return results
