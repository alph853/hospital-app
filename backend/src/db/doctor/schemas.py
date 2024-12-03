from pydantic import BaseModel
from datetime import date
from typing import Optional

class DoctorResponseModel(BaseModel):
    ecode: int
    lname: str 
    fname: str 
    dob: Optional[date]
    address: str
    gender: str 
    start_date: date 
    degree_name: str 
    degree_year: int 
    dcode: int 
    dtitle: str


class TreatmentItem(BaseModel):
    diagnosis: str
    sid: int
    start_date: date
    end_date: Optional[date]
    result: Optional[str]
    recover_f: bool

class PatientTreatmentResponse(BaseModel):
    pid: int
    ipid: str
    fname: str
    lname: str
    dob: Optional[date]
    address: Optional[str]
    phone: str
    gender: str
    Treatment: list[TreatmentItem]
