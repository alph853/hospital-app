
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select, update, func, union
from ..models import Doctor, Nurse, Outpatient, Inpatient, Department

class HospitalService: 
    async def count_staff(self, session: AsyncSession):
      
        doctor_query = select(func.count()).select_from(Doctor)
        doctor_result = await session.execute(doctor_query)
        doctors = doctor_result.scalar() or 0 


        nurse_query = select(func.count()).select_from(Nurse)
        nurse_result = await session.execute(nurse_query)
        nurses = nurse_result.scalar() or 0  

        inpatient_query = select(Inpatient.pid)
        outpatient_query = select(Outpatient.pid)
        combined_query = union(inpatient_query, outpatient_query).subquery()
        count_query = select(func.count(func.distinct(combined_query.c.pid)))
        patient_result = await session.execute(count_query)
        patient_count = patient_result.scalar() or 0

        return {"patients": patient_count, "doctors": doctors, "nurses": nurses}
    
    async def find_all_departments(self,session: AsyncSession):
        query = select(Department.dtitle)
        res = await session.exec(query)
        return [{
            'dtitle': row
        }
        for row in res
        ]