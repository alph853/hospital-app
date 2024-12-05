from .schemas import PatientAddModel, TreatmentResponseModel, PatientResponseModel, ExaminationModel, PatientAddModelExisted, DoctorModel, PatientSearchModel, PatientModel, ExaminationAddModel, AdmissionAddModel
from ..models import Inpatient, Outpatient, Examination, Treatment, Treat, Doctor, Admission
from sqlalchemy import func, and_, or_, text
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, update
from typing import List
from fastapi import HTTPException
class PatientService: 
    async def create_new_patient(self, patient_data: PatientAddModel, session: AsyncSession):
        patient_data_dict = patient_data.model_dump()
        # pid = -1 => insert thang do table 
        # pid != -1 => goi insert_patient => true => update 
        # false => invalid pid 
        # insert false : 
        patient_type = patient_data_dict.pop('type')
            # 0 la inpatient, 1 outpatient
        new_patient = None
        if patient_type != 0:      
            new_patient = Inpatient(**patient_data_dict)
        else: 
            new_patient = Outpatient(**patient_data_dict)

        session.add(new_patient)
        await session.commit()  
        await session.refresh(new_patient)
        return new_patient 

    async def create_existed_patient(self,patient_data:PatientAddModelExisted,session:AsyncSession): 
        patient_data_dict = patient_data.model_dump()
        patient_type = patient_data_dict.pop('type')
        pid = patient_data_dict.pop('pid')
        print('hi\n\n\n\n\n\n\n\n\nhi')
        if not patient_data_dict['phone'] or patient_data_dict['phone'] == "":
            hi = patient_data_dict.pop('phone')
        if not patient_data_dict['address'] or patient_data_dict['address'] == "":
            hi = patient_data_dict.pop('address')
        
        query = text('SELECT INSERT_PATIENT(:pid,:type) AS RESULT')
        result = await session.execute(query,{'pid':pid,'type':'outpatient' if not patient_type else 'inpatient'})
        successful = result.scalar()
        if len(patient_data_dict) == 0: 
            successful = False
        if successful: 
            print('sucessful',patient_data_dict)
            target_table = Inpatient if not patient_type == 0 else Outpatient
            query = (update(target_table).where(target_table.pid == pid).values(**patient_data_dict).returning(*target_table.__table__.columns))
            result = await session.execute(query)
            updated_row = result.fetchone()
            await session.commit()
            print('sucessful4',patient_data_dict)
            return updated_row._asdict() if updated_row else None
            
        await session.commit()
        print('sucessful2',patient_data_dict)
        return None
                
    async def insert_examination(self,examination_data:ExaminationAddModel,session: AsyncSession):
        data = examination_data.model_dump()
        new_examination = Examination(**data)
        session.add(new_examination)
        await session.commit()  
        await session.refresh(new_examination)
        return new_examination 
    
    async def insert_admission(self,admission_data:AdmissionAddModel,session: AsyncSession):
        data = admission_data.model_dump()
        new_admission = Admission(**data)
        session.add(new_admission)
        await session.commit()  
        await session.refresh(new_admission)
        return new_admission

    async def search_patient(self,search_data:PatientSearchModel,session:AsyncSession):
        rows = None
        if search_data.pid: 
            inpatient_query = select(Inpatient.pid,Inpatient.lname,Inpatient.fname,Inpatient.dob,Inpatient.address, Inpatient.phone,Inpatient.gender).where(Inpatient.pid == search_data.pid)
            outpatient_query = select(Outpatient.pid,Outpatient.lname,Outpatient.fname,Outpatient.dob,Outpatient.address, Outpatient.phone,Outpatient.gender).where(Outpatient.pid == search_data.pid)
            query = inpatient_query.union(outpatient_query)

            res = await session.exec(query)
            rows = res.all()
        elif search_data.fname and search_data.lname: 
            query = text('''
            (SELECT PID, LNAME, FNAME, DOB, ADDRESS, PHONE, GENDER FROM INPATIENT
            WHERE LOWER(LNAME) = :lname and LOWER(FNAME) = :fname) 
            UNION 
            (SELECT PID, LNAME, FNAME, DOB, ADDRESS, PHONE, GENDER FROM OUTPATIENT
            WHERE LOWER(LNAME) = :lname and LOWER(FNAME) = :fname)''')
            results = await session.execute(query,{'lname':search_data.lname.lower(),'fname': search_data.fname.lower()})
            rows = results.fetchall()
        elif search_data.fname and not search_data.lname: 
            query = text('''
            (SELECT PID, LNAME, FNAME, DOB, ADDRESS, PHONE, GENDER FROM INPATIENT
            WHERE LOWER(LNAME) = :fname or LOWER(FNAME) = :fname) 
            UNION 
            (SELECT PID, LNAME, FNAME, DOB, ADDRESS, PHONE, GENDER FROM OUTPATIENT
            WHERE LOWER(LNAME) = :fname or LOWER(FNAME) = :fname)''')
            results = await session.execute(query,{'fname': search_data.fname.lower()})
            rows = results.fetchall()
        if rows: 
            return [
                PatientModel(
                    pid=row[0],
                    lname=row[1],
                    fname=row[2],
                    dob=row[3],
                    address=row[4],
                    phone=row[5],
                    gender=row[6]
                )
                for row in rows
            ]



        
    async def find_examination_by_pid(self,pid:int,session:AsyncSession):
        query = select(Examination.sid,
                Examination.fee,
                Examination.e_date,
                Examination.diagnosis,
                Examination.next_exam_date,
                Examination.did,
                Examination.med_f,
                Doctor.ecode,
                Doctor.lname,
                Doctor.fname,).join(Doctor,Examination.did == Doctor.ecode).where(Examination.pid == pid)
        res = await session.exec(query)
        rows = res.all()
        examinations = []
        for row in rows:
            exam_data = {
                "sid": row.sid,
                "fee": row.fee,
                "e_date": row.e_date,
                "diagnosis": row.diagnosis,
                "next_exam_date": row.next_exam_date,
                "doctor": {
                    "ecode": row.did,
                    "name": row.lname + ' ' + row.fname,
                },
                "did": row.did,
                "med_f": row.med_f,
            }
            examinations.append(ExaminationModel(**exam_data))
        
        return examinations

    async def find_treatment_by_pid(self,pid:int,session:AsyncSession):
        query = select(Treatment,Treat.did,Doctor.fname, Doctor.lname).join(Treat,Treatment.sid == Treat.sid).join(Doctor, Treat.did == Doctor.ecode).where(Treat.pid==pid)
        results = await session.exec(query)
        treatments = results.all()

        treatment_dict = {}
        for treatment, did, fname, lname in treatments:
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

            treatment_dict[treatment.sid]["did"].append(DoctorModel(**{'ecode':did,'name':fname + ' ' + lname}))


        return [TreatmentResponseModel(**data) for data in treatment_dict.values()]
    
    async def get_patient_by_id(self,pid: int, session: AsyncSession) -> PatientResponseModel:
        outpatient_query = (
            select(Outpatient, Examination, Doctor)  
            .outerjoin(Examination, Examination.pid == Outpatient.pid)
            .outerjoin(Doctor, Doctor.ecode == Examination.did)  
            .where(Outpatient.pid == pid)
        )

        outpatient_results = await session.execute(outpatient_query)
        outpatient_rows = outpatient_results.fetchall()
        if outpatient_rows is None:
            raise HTTPException(status_code=404, detail="Patient not found")
        examinations = []
        for outpatient, exam, doctor in outpatient_rows:
            if exam:
                doctor_model = DoctorModel(ecode=doctor.ecode, name=doctor.fname + ' ' + doctor.lname) 
                examinations.append(ExaminationModel(
                    sid=exam.sid,
                    fee=exam.fee,
                    e_date=exam.e_date,
                    diagnosis=exam.diagnosis,
                    next_exam_date=exam.next_exam_date,
                    pid=exam.pid,
                    did=doctor_model,  # List of doctors in did
                    med_f=exam.med_f
                ))

        # Inpatient query to get treatment and doctor details
        inpatient_query = (
            select(Inpatient, Treat, Treatment, Doctor)
            .outerjoin(Treat, Treat.pid == Inpatient.pid)
            .outerjoin(Treatment, Treat.sid == Treatment.sid)
            .outerjoin(Doctor, Doctor.ecode == Treat.did)
            .where(Inpatient.pid == pid)
        )

        inpatient_results = await session.execute(inpatient_query)
        inpatient_rows = inpatient_results.fetchall()

        treatments_dict = {}
        patient_data = None
        for inpatient, treat, treatment, doctor in inpatient_rows:
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
                # Add the doctor to the treatments dictionary
                doctor_model = DoctorModel(ecode=doctor.ecode, name=doctor.fname + ' ' + doctor.lname)
                treatments_dict[treatment.sid]["did"].add(doctor_model)

        
        for treatment in treatments_dict.values():
            treatment["did"] = list(treatment["did"])

        treatments = [TreatmentResponseModel(**data) for data in treatments_dict.values()]

        if not patient_data:
            for outpatient, _, _ in outpatient_rows:
                patient_data = outpatient
                break

        # Create the final patient response model
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
        SELECT t_consists_of.sid, mid, quantity, name, price 
        FROM t_consists_of 
        JOIN medication ON t_consists_of.mid = medication.medication_id
        WHERE t_consists_of.sid IN (SELECT SID FROM TEMP);
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
    

    async def get_patient_by_name(self,name:str,session:AsyncSession):
        query = '''
            WITH TEMP AS ((SELECT ipid as id, FNAME || ' ' || LNAME AS NAME FROM INPATIENT) UNION (SELECT opid as id,  FNAME || ' ' || LNAME AS NAME FROM OUTPATIENT))
            SELECT * FROM TEMP WHERE LOWER(NAME) LIKE :name 
        '''
        params = {'name': f'%{name.lower()}%'}
        result = await session.execute(text(query),params)
        patients = [dict(row) for row in result.mappings()]
        return patients

    async def get_patient_type_byID(self,pid:int,session:AsyncSession):
        query = select(Inpatient).where(Inpatient.pid == pid)
        res = await session.exec(query)
        inpatient_type = res.first()
        
        query = select(Outpatient).where(Outpatient.pid == pid)
        res = await session.exec(query)
        outpatient_type = res.first()

        if inpatient_type and outpatient_type: 
            return {'type':2}
        elif inpatient_type and not outpatient_type: 
            return {'type':1}
        elif not inpatient_type and outpatient_type: 
            return {'type':0}
        else: return None






    