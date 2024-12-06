from pydantic import BaseModel
from datetime import date
from typing import Optional

class PatientSearchModel(BaseModel): 
    pid: Optional[int] = None
    lname: Optional[str] = None 
    fname: Optional[str] = None
    phone: Optional[str] = None
class AdmissionModel(BaseModel):
    pid: Optional[int] = None
    date_of_adm: date 
    room: str 
    diagnosis: str 
    fee: float 
    nurse_id: int 

class ExaminationAddModel(BaseModel):
    fee: int 
    diagnosis: Optional[str]
    next_exam_date: Optional[date] = None
    pid: int
    did: int

class AdmissionAddModel(BaseModel):
    pid: int
    date_of_adm: Optional[date] = None
    room: str
    nurse_id: int 
    diagnosis: Optional[str] = None
    fee: int

class PatientModel(BaseModel):
    pid: int 
    lname: str 
    fname: str 
    dob: Optional[date]
    address: Optional[str] 
    phone: Optional[str] 
    gender: str 

class InPatientModel(BaseModel):
    pid: int 
    ipid: str
    lname: str 
    fname: str 
    dob: Optional[date]
    address: Optional[str] 
    phone: Optional[str] 
    gender: str 

    
class OutPatientModel(BaseModel):
    pid: int 
    opid: str
    lname: str 
    fname: str 
    dob: Optional[date]
    address: Optional[str] 
    phone: Optional[str] 
    gender: str 
class PatientAddModel(BaseModel):
    fname: str
    lname: str
    dob: date 
    address: str
    phone: str
    gender: str
    # 0 for inpatient, 1 for outpatient
    type: int

class PatientAddModelExisted(BaseModel):
    pid: int
    address: Optional[str] = None
    phone: Optional[str] = None
    # 0 for inpatient, 1 for outpatient
    type: int

class DoctorModel(BaseModel):
    ecode: int
    name: str
    def __hash__(self):
        # Hash by the unique attributes (in this case, 'ecode')
        return hash((self.ecode,))

    def __eq__(self, other):
        # Equality based on 'ecode' (assuming doctors are unique by their ecode)
        return self.ecode == other.ecode

class ExaminationModel(BaseModel):
    sid: int
    fee: float 
    e_date: date 
    diagnosis: str
    next_exam_date: Optional[date]
    did: DoctorModel
    med_f: bool 

class TreatmentResponseModel(BaseModel):
    sid: int
    start_date: date 
    end_date: Optional[date]
    result: Optional[str] 
    recover_f: bool
    med_f: bool 
    did:list[DoctorModel]
    pid: int 

class PatientResponseModel(BaseModel):
    pid: int 
    lname: str
    fname: str
    dob: Optional[date] = None
    address: Optional[str] = None 
    phone: Optional[str ] = None
    gender: str
    examinations: list[ExaminationModel]
    treatments: list[TreatmentResponseModel]


