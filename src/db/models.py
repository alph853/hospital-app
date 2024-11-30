from sqlmodel import SQLModel, Field, Column
from typing import Optional
from sqlalchemy import Integer, String, Date, ForeignKey, CheckConstraint, Numeric, Boolean, ForeignKeyConstraint, func
from datetime import date




class Doctor(SQLModel, table=True):
    ecode: Optional[int] = Field(default=None, sa_column=Column(Integer, autoincrement=True, primary_key=True))
    lname: str = Field(sa_column=Column(String(20), nullable=False))
    fname: str = Field(sa_column=Column(String(20), nullable=False))
    dob: Optional[date] = Field(sa_column=Column(Date, nullable=True))
    address: Optional[str] = Field(sa_column=Column(String, nullable=True))
    gender: str = Field(sa_column=Column(String(1), nullable=False))
    start_date: date = Field(sa_column=Column(Date, nullable=False))
    degree_name: str = Field(sa_column=Column(String(100), nullable=False))
    degree_year: int = Field(sa_column=Column(Integer, CheckConstraint('degree_year >= 1900 AND degree_year <= 2100'), nullable=False))
    dcode: int = Field(sa_column=Column(Integer, ForeignKey("department.dcode", name="fk_doctor_dcode"), nullable=False))

class Nurse(SQLModel, table=True):
    ecode: Optional[int] = Field(default=None, sa_column=Column(Integer, autoincrement=True, primary_key=True))
    lname: str = Field(sa_column=Column(String(20), nullable=False))
    fname: str = Field(sa_column=Column(String(20), nullable=False))
    dob: Optional[date] = Field(sa_column=Column(Date, nullable=True))
    address: Optional[str] = Field(sa_column=Column(String, nullable=True))
    gender: str = Field(sa_column=Column(String(1), nullable=False))
    start_date: date = Field(sa_column=Column(Date, nullable=False))
    degree_name: str = Field(sa_column=Column(String(100), nullable=False))
    degree_year: int = Field(sa_column=Column(Integer, CheckConstraint('degree_year >= 1900 AND degree_year <= 2100'), nullable=False))
    dcode: int = Field(sa_column=Column(Integer, ForeignKey("department.dcode", name="fk_nurse_dcode"), nullable=False))

class Department(SQLModel, table=True):
    dcode: Optional[int] = Field(default=None, sa_column=Column(Integer, autoincrement=True, primary_key=True))
    dtitle: str = Field(sa_column=Column(String(100), nullable=False))
    mgr_code: Optional[int] = Field(sa_column=Column(Integer, ForeignKey("doctor.ecode", name="fk_mgr_code"), nullable=True))

class Phone(SQLModel, table=True):
    ecode: int = Field(sa_column=Column(Integer,ForeignKey("doctor.ecode") ,nullable=False,primary_key=True))
    phone_num: str = Field(sa_column=Column(String(12), primary_key=True))

class Examination(SQLModel, table=True):
    sid: Optional[int] = Field(default=None, sa_column=Column(Integer, autoincrement=True, primary_key=True))
    fee: float = Field(sa_column=Column(Numeric(10, 2), CheckConstraint('fee > 0'), nullable=False))
    e_date: date = Field(default_factory=date.today, sa_column=Column(Date, nullable=False, server_default=func.now()))
    diagnosis: str = Field(sa_column=Column(String(200), nullable=True))
    next_exam_date: Optional[date] = Field(sa_column=Column(Date, nullable=True))
    pid: int = Field(sa_column=Column(Integer, ForeignKey("outpatient.pid", name="fk_examination_pid"), nullable=False))
    did: int = Field(sa_column=Column(Integer, ForeignKey("doctor.ecode", name="fk_examination_did"), nullable=False))
    med_f: bool = Field(default=False, sa_column=Column(Boolean, nullable=False))

class Treatment(SQLModel, table=True):
    sid: Optional[int] = Field(default=None, sa_column=Column(Integer, autoincrement=True, primary_key=True))
    start_date: date = Field(sa_column=Column(Date, nullable=False))
    end_date: Optional[date] = Field(sa_column=Column(Date, nullable=True))
    result: Optional[str] = Field(sa_column=Column(String(100), nullable=True))
    # t_fee: Optional[float] = Field(sa_column=Column(Numeric(10, 2), nullable=True))
    recover_f: bool = Field(default=False, sa_column=Column(Boolean, nullable=False))
    med_f: bool = Field(default=False, sa_column=Column(Boolean, nullable=False))

class Admission(SQLModel, table=True):
    pid: int = Field(sa_column=Column(Integer, ForeignKey("inpatient.pid", name="fk_admission_pid"), primary_key=True, nullable=False))
    date_of_adm: date = Field(default_factory=date.today, sa_column=Column(Date, primary_key=True))
    date_of_disc: Optional[date] = Field(sa_column=Column(Date, nullable=True))
    room: str = Field(sa_column=Column(String(10), nullable=False))
    diagnosis: str = Field(sa_column=Column(String(200), nullable=True))
    fee: float = Field(sa_column=Column(Numeric(10, 2), CheckConstraint('fee > 0'), nullable=True))
    nurse_id: int = Field(sa_column=Column(Integer, ForeignKey("nurse.ecode"), nullable=False))

class Treat(SQLModel, table=True):
    did: int = Field(sa_column=Column(Integer, ForeignKey("doctor.ecode", name="fk_treat_did"), primary_key=True))
    sid: int = Field(sa_column=Column(Integer, ForeignKey("treatment.sid", name="fk_treat_sid"), primary_key=True))
    pid: int = Field(sa_column=Column(Integer, primary_key=True))
    date_of_adm: date = Field(sa_column=Column(Date, primary_key=True))

    __table_args__ = (
        ForeignKeyConstraint(
            ["pid", "date_of_adm"],  
            ["admission.pid", "admission.date_of_adm"], 
            name="fk_treat_pid_date_of_adm"
        ),
    )



class Inpatient(SQLModel, table=True):
    pid: Optional[int] = Field(default=None, sa_column=Column(Integer, autoincrement=True, primary_key=True))
    ipid: Optional[str] = Field(sa_column=Column(String(11), nullable=True))
    lname: str = Field(sa_column=Column(String(20), nullable=False))
    fname: str = Field(sa_column=Column(String(20), nullable=False))
    dob: Optional[date] = Field(sa_column=Column(Date, nullable=True))
    address: Optional[str] = Field(sa_column=Column(String, nullable=True))
    phone: str = Field(sa_column=Column(String(12), nullable=False))
    gender: str = Field(sa_column=Column(String(1), nullable=False))
    

class Outpatient(SQLModel, table=True):
    pid: Optional[int] = Field(default=None, sa_column=Column(Integer, autoincrement=True, primary_key=True))
    opid: Optional[str] = Field(sa_column=Column(String(11), nullable=True))
    lname: str = Field(sa_column=Column(String(20), nullable=False))
    fname: str = Field(sa_column=Column(String(20), nullable=False))
    dob: Optional[date] = Field(sa_column=Column(Date, nullable=True))
    address: Optional[str] = Field(sa_column=Column(String, nullable=True))
    phone: str = Field(sa_column=Column(String(12), nullable=False))
    gender: str = Field(sa_column=Column(String(1), nullable=False))

class Medication(SQLModel, table=True):
    medication_id: Optional[int] = Field(sa_column=Column(Integer, autoincrement=True, primary_key=True))
    name: str = Field(sa_column=Column(String(100), nullable=False))
    price: float = Field(sa_column=Column(Numeric(10, 2), CheckConstraint('price > 0'), nullable=False))

class Effect(SQLModel, table=True):
    m_id: int = Field(sa_column=Column(Integer, ForeignKey("medication.medication_id", name="fk_effect_m_id"), primary_key=True))
    effect: str = Field(sa_column=Column(String(100), primary_key=True))

class Provider(SQLModel, table=True):
    pnum: Optional[int] = Field(default=None, sa_column=Column(Integer, autoincrement=True, primary_key=True))
    name: str = Field(sa_column=Column(String(100), nullable=False))
    phone: str = Field(sa_column=Column(String(20), nullable=False))
    address: Optional[str] = Field(sa_column=Column(String(255), nullable=True))

class Batch(SQLModel,table=True):
    batch_id: Optional[int] = Field(sa_column=Column(Integer, autoincrement=True, primary_key=True))
    imported_date: date = Field(sa_column=Column(Date,nullable=False))
    provider_num: int = Field(sa_column=Column(Integer,ForeignKey("provider.pnum"),nullable=False))

class Contains(SQLModel,table=True):
    batch_id: int = Field(sa_column=Column(Integer, ForeignKey("batch.batch_id", name="fk_contains_batch_id"), primary_key=True))
    m_id: int = Field(sa_column=Column(Integer, ForeignKey("medication.medication_id", name="fk_contains_m_id"), primary_key=True))
    imported_price: float = Field(sa_column=Column(Numeric(10, 2), CheckConstraint('imported_price > 0'), nullable=False))
    imported_quantity: int = Field(sa_column=Column(Integer, CheckConstraint('imported_quantity > 0'), nullable=False))
    exp_date: date = Field(sa_column=Column(Date,nullable=False))
    # set trigger for exp_flag
    exp_flag: bool = Field(default=False, sa_column=Column(Boolean, nullable=False))


class e_consist_of(SQLModel,table=True):
    sid: int = Field(sa_column=Column(Integer,ForeignKey("examination.sid",name="fd_e_consist_sid"),primary_key=True))
    mid: int = Field(sa_column=Column(Integer,ForeignKey("medication.medication_id",name="fd_e_consist_mid"),primary_key=True))
    quantity: int = Field(sa_column=Column(Integer, CheckConstraint('quantity > 0'), nullable=False))

class t_consist_of(SQLModel,table=True):
    sid: int = Field(sa_column=Column(Integer,ForeignKey("treatment.sid",name="fd_t_consist_sid"),primary_key=True))
    mid: int = Field(sa_column=Column(Integer,ForeignKey("medication.medication_id",name="fd_t_consist_mid"),primary_key=True))
    quantity: int = Field(sa_column=Column(Integer, CheckConstraint('quantity > 0'), nullable=False))