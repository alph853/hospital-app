from .schemas import PatientAddModel, TreatmentResponseModel, PatientResponseModel, ExaminationModel
from ..models import Inpatient, Outpatient, Admission, Examination, Treatment, Treat
from sqlalchemy import func, and_, or_, text
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from .schemas import PatientAddModel

class PatientService: 
    async def _generate_new_pid(self, session: AsyncSession) -> int:
       
        inpatient_max_pid_query = await session.exec(select(func.max(Inpatient.pid)))
        inpatient_max_pid = inpatient_max_pid_query.first() or 0 

        outpatient_max_pid_query = await session.exec(select(func.max(Outpatient.pid)))
        outpatient_max_pid = outpatient_max_pid_query.first() or 0  
        next_pid = max(inpatient_max_pid, outpatient_max_pid) + 1
        return next_pid
    
    async def create_patient(self, patient_data: PatientAddModel, session: AsyncSession):
        patient_data_dict = patient_data.model_dump()
        patient_type = patient_data_dict.pop('type')
        ipid = None
        opid = None
        if patient_data_dict['pid'] != -1: 
            query1 = select(Inpatient).where(Inpatient.pid == patient_data_dict['pid'])
                
            query2 = select(Outpatient).where(Outpatient.pid == patient_data_dict['pid'])
    
            result1 = await session.exec(query1)
            inpatient = result1.first()
            ipid = inpatient.ipid if inpatient else None

            result2 = await session.exec(query2)
            outpatient = result2.first()
            opid = outpatient.opid if outpatient else None

            if not ipid and not opid:
                return None
        
        else: 
            patient_data_dict['pid'] = await self._generate_new_pid(session)

        new_patient = None
        if patient_type == 0: 
            admission = patient_data_dict.pop('admission')
            admission['pid'] = patient_data_dict['pid']
            if not ipid: 
                new_patient = Inpatient(**patient_data_dict)

                session.add(new_patient)
                await session.commit()  
        
          
                new_patient.ipid = f"IP{new_patient.pid:09}"  
                await session.commit()
            new_admission = Admission(**admission)
            session.add(new_admission)
            await session.commit()
            return new_patient if new_patient else new_admission
    
        else:  # Outpatient
            if not opid:
                new_patient = Outpatient(**patient_data_dict)
                session.add(new_patient)
                await session.commit()  
        
        
                new_patient.opid = f"OP{new_patient.pid:09}"  
                await session.commit()
                return new_patient
        
    async def find_examination_by_pid(self,pid:int,session:AsyncSession):
        query = select(Examination).where(Examination.pid == pid)
        res = await session.exec(query)
        return res

    async def find_treatment_by_pid(self,pid:int,session:AsyncSession):
        query = select(Treatment,Treat.did).join(Treat,Treatment.sid == Treat.sid).where(Treat.pid==pid)
        results = await session.exec(query)
        treatments = results.all()

        treatment_dict = {}
        for treatment, did in treatments:
            if treatment.sid not in treatment_dict:
                treatment_dict[treatment.sid] = {
                    "sid": treatment.sid,
                    "start_date": treatment.start_date,
                    "end_date": treatment.end_date,
                    "result": treatment.result,
                    "recover_f": treatment.recover_f,
                    "med_f": treatment.med_f,
                    "did": [],
                    "pid": pid,
                }
        
            treatment_dict[treatment.sid]["did"].append(did)


        return [TreatmentResponseModel(**data) for data in treatment_dict.values()]
    
    async def get_patient_by_id(self, pid: int, session: AsyncSession) -> PatientResponseModel:
        outpatient_query = (
        select(Outpatient, Examination)
        .join(Examination, Examination.pid == Outpatient.pid)
        .where(Outpatient.pid == pid)
        )

        outpatient_results = await session.exec(outpatient_query)
        outpatient_rows = outpatient_results.all()

        examinations = []
        for outpatient, exam in outpatient_rows:
            if exam and exam.sid not in [e.sid for e in examinations]:
                examinations.append(ExaminationModel(**exam.dict()))

        inpatient_query = (
        select(Inpatient, Treat, Treatment, Treat.did)
        .join(Treat, Treat.pid == Inpatient.pid)
        .join(Treatment, Treat.sid == Treatment.sid)
        .where(Inpatient.pid == pid)
        )

        inpatient_results = await session.exec(inpatient_query)
        inpatient_rows = inpatient_results.all()

        treatments_dict = {}
        patient_data = None  
        for inpatient, treat, treatment, did in inpatient_rows:
        
            patient_data = inpatient

        
            if treatment:
                if treatment.sid not in treatments_dict:
                    treatments_dict[treatment.sid] = {
                    "sid": treatment.sid,
                    "start_date": treatment.start_date,
                    "end_date": treatment.end_date,
                    "result": treatment.result,
                    "recover_f": treatment.recover_f,
                    "med_f": treatment.med_f,
                    "did": set(),
                    "pid": pid,
                }
                treatments_dict[treatment.sid]["did"].add(did)

   
        for treatment in treatments_dict.values():
            treatment["did"] = list(treatment["did"])
        
        treatments = [TreatmentResponseModel(**data) for data in treatments_dict.values()]

    
        if not patient_data:
            for outpatient, _ in outpatient_rows:
                patient_data = outpatient
                break

   
        patient_response = PatientResponseModel(
            pid=patient_data.pid,
            lname=patient_data.lname,
            fname=patient_data.fname,
        dob=patient_data.dob,
        address=patient_data.address,
        phone=patient_data.phone,
        gender=patient_data.gender,
        examinations=examinations,
        treatments=treatments
        )

        return patient_response
    
    async def get_medication_info_by_pid(self,pid:int,session: AsyncSession):
        query1 = '''
        WITH TEMP AS (SELECT SID FROM TREAT WHERE PID = :pid)
        SELECT t_consist_of.sid, mid, quantity, name, price 
        FROM t_consist_of 
        JOIN medication ON t_consist_of.mid = medication.medication_id
        WHERE t_consist_of.sid IN (SELECT SID FROM TEMP);
        '''
        result = await session.execute(text(query1), {"pid": pid})
        datas = [dict(row) for row in result.mappings()]
        meds = []
        for data in datas:
            k = False
            for med in meds: 
                if med['sid'] == data['sid']:
                    k = True
                    med['medication'].append({
                        "mid": data['mid'],
                        "quantity": data['quantity'],
                        "name": data['name'],
                        "price": data['price']
                    })
                    med['total_fee'] = med['total_fee'] + data['quantity']*data['price']
                if k: break
            if not k: 
                meds.append({
                    "sid": data['sid'],
                    "medication":[{
                        "mid": data['mid'],
                        "quantity": data['quantity'],
                        "name": data['name'],
                        "price": data['price']
                    }],
                    "total_fee": data['quantity']*data['price']
                })
            
        return meds




    