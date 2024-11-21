from pydantic import BaseModel
from datetime import date
from typing import Optional

class AdmissionModel(BaseModel):
    pid: Optional[int] = None
    date_of_adm: date 
    room: str 
    diagnosis: str 
    fee: float 
    nurse_id: int 

class InPatientModel(BaseModel):
    pid: int
    ipid: str 
    lname: str 
    fname: str 
    dob: date
    address: str 
    phone: str 
    gender: str 

    
class OutPatientModel(BaseModel):
    pid: int 
    opid: str 
    lname: str 
    fname: str 
    dob: date
    address: str 
    phone: str 
    gender: str
    class Config:
        orm_mode = True
        from_attributes = True 

class PatientAddModel(BaseModel):
    pid: int
    fname: str
    lname: str
    dob: date 
    address: str
    phone: str
    gender: str
    admission: Optional[AdmissionModel] = None
    # 0 for inpatient, 1 for outpatient
    type: int

class ExaminationModel(BaseModel):
    sid: int
    fee: float 
    e_date: date 
    diagnosis: str
    next_exam_date: Optional[date]
    pid: int 
    did: int 
    med_f: bool 

class TreatmentResponseModel(BaseModel):
    sid: int
    start_date: date 
    end_date: Optional[date]
    result: Optional[str] 
    recover_f: bool
    med_f: bool 
    did: list[int]
    pid: int 

class PatientResponseModel(BaseModel):
    pid: int 
    lname: str
    fname: str
    dob: Optional[date]
    address: Optional[str]
    phone: str
    gender: str
    examinations: list[ExaminationModel]
    treatments: list[TreatmentResponseModel]


