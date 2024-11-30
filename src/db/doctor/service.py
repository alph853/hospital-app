from sqlmodel.ext.asyncio.session import AsyncSession
from .schemas import DoctorResponseModel, PatientTreatmentResponse, TreatmentItem
from ..models import Doctor, Department, Treat, Inpatient, Admission, Treatment
from sqlmodel import select
from sqlalchemy import and_, distinct

class DoctorService: 
    async def get_all_doctors(self,session:AsyncSession): 
        query = (
            select(Doctor, Department.dtitle)
            .join(Department, Doctor.dcode == Department.dcode)
        )
        results = await session.exec(query)
        doctors = results.all()
        doctor_list = [
            DoctorResponseModel(
                ecode=doctor.ecode,
                lname=doctor.lname,
                fname=doctor.fname,
                dob=doctor.dob,
                address=doctor.address,
                gender=doctor.gender,
                start_date=doctor.start_date,
                degree_name=doctor.degree_name,
                degree_year=doctor.degree_year,
                dcode=doctor.dcode,
                dtitle=dtitle  # Department title
            )
            for doctor, dtitle in doctors
        ]
        return doctor_list

    async def get_doctor_by_id(self, ecode: int, session: AsyncSession):
        query = (
            select(Doctor, Department.dtitle)
            .join(Department, Doctor.dcode == Department.dcode)
            .where(Doctor.ecode == ecode)
        )
        results = await session.exec(query)
        result = results.first()

        if not result:
            return None

        doctor, dtitle = result

        doctor_response = DoctorResponseModel(
        ecode=doctor.ecode,
        lname=doctor.lname,
        fname=doctor.fname,
        dob=doctor.dob,
        address=doctor.address,
        gender=doctor.gender,
        start_date=doctor.start_date,
        degree_name=doctor.degree_name,
        degree_year=doctor.degree_year,
        dcode=doctor.dcode,
        dtitle=dtitle  # Department title
        )

        return doctor_response
    
    async def get_treated_patients(self,ecode:int,session:AsyncSession):
        query = (
        select(
            Treat,
            Treatment,
            Admission,
            Inpatient,
        )
        .select_from(Treat)
        .join(Treatment,Treat.sid == Treatment.sid)
        .join(Admission, and_(Treat.pid == Admission.pid, Treat.date_of_adm == Admission.date_of_adm))
        .join(Inpatient, Treat.pid == Inpatient.pid)
        .where(Treat.did == ecode)
        )
        results = await session.exec(query)
        patients = results.all()
        print(patients)
        result = {}
        for treat, recovery_data ,admission, inpatient in patients:
            if treat.pid not in result:
                result[treat.pid] = {
                "pid": inpatient.pid,
                "ipid": inpatient.ipid,
                "fname": inpatient.fname,
                "lname": inpatient.lname,
                "dob": inpatient.dob,
                "address": inpatient.address,
                "phone": inpatient.phone,
                "gender": inpatient.gender,
                "Treatment": []
                }   
    
    
                start_date = recovery_data.start_date
                end_date = recovery_data.end_date
                result[treat.pid]["Treatment"].append({
                    "diagnosis": admission.diagnosis,
                    "sid": treat.sid,
                    "start_date": start_date,
                    "end_date": end_date,
                    "result": recovery_data.result,
                    "recover_f": recovery_data.recover_f
                })
            else: 
                start_date = recovery_data.start_date
                end_date = recovery_data.end_date
                result[treat.pid]["Treatment"].append({
                    "diagnosis": admission.diagnosis,
                    "sid": treat.sid,
                    "start_date": start_date,
                    "end_date": end_date,
                    "result": recovery_data.result,
                    "recover_f": recovery_data.recover_f
                })
        # Convert directly to list of PatientTreatmentResponse
        final_result_objects = [
            PatientTreatmentResponse(
        pid=patient["pid"],
        ipid=patient["ipid"],
        fname=patient["fname"],
        lname=patient["lname"],
        dob=patient["dob"],
        address=patient["address"],
        phone=patient["phone"],
        gender=patient["gender"],
        Treatment=[
            TreatmentItem(
                diagnosis=treatment["diagnosis"],
                sid=treatment["sid"],
                start_date=treatment["start_date"],
                end_date=treatment["end_date"],
                result=treatment["result"],
                recover_f=treatment["recover_f"]
            )
            for treatment in patient["Treatment"]
            ]
        )
        for patient in result.values()
    ]
        return final_result_objects


#         query = (
#         select(
#             distinct(Inpatient.pid).label('pid'),
#             Inpatient.ipid.label('ipid'),
#             Inpatient.fname.label('fname'),
#             Inpatient.lname.label('lname'),
#             Inpatient.dob.label('dob'),
#             Inpatient.address.label('address'),
#             Inpatient.phone.label('phone'),
#             Inpatient.gender.label('gender')
#         )
#         .select_from(Treat)
#         .join(Admission, and_(Treat.pid == Admission.pid, Treat.date_of_adm == Admission.date_of_adm))
#         .join(Inpatient, Treat.pid == Inpatient.pid)
#         .where(Treat.did == ecode)
#         )
#         results = await session.exec(query)
#         patients = results.all()
#         if not patients:
#             return None
#         responses = [
#     PatientTreatmentResponse(
#         pid=patient.pid,
#         ipid=patient.ipid,
#         fname=patient.fname,
#         lname=patient.lname,
#         dob=patient.dob,
#         address=patient.address,
#         phone=patient.phone,
#         gender=patient.gender,
#     )
#     for patient in patients
# ]
#         return responses

