CREATE TABLE doctor (
        ecode SERIAL NOT NULL,
        lname VARCHAR(20) NOT NULL,
        fname VARCHAR(20) NOT NULL,
        dob DATE,
        address VARCHAR,
        gender VARCHAR(1) NOT NULL,
        start_date DATE NOT NULL,
        degree_name VARCHAR(100) NOT NULL,
        degree_year INTEGER NOT NULL CHECK (degree_year >= 1900 AND degree_year <= 2100),
        dcode INTEGER NOT NULL,
        PRIMARY KEY (ecode)
)



CREATE TABLE department (
        dcode SERIAL NOT NULL,
        dtitle VARCHAR(100) NOT NULL,
        mgr_code INTEGER,
        PRIMARY KEY (dcode)
)


2024-11-14 10:15:37,289 INFO sqlalchemy.engine.Engine [no key 0.00087s] ()
2024-11-14 10:15:37,289 INFO sqlalchemy.engine.Engine
CREATE TABLE treatment (
        sid SERIAL NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        result VARCHAR(100),
        t_fee NUMERIC(10, 2),
        recover_f BOOLEAN NOT NULL,
        med_f BOOLEAN NOT NULL,
        PRIMARY KEY (sid)
)


2024-11-14 10:15:37,289 INFO sqlalchemy.engine.Engine [no key 0.00131s] ()
2024-11-14 10:15:37,304 INFO sqlalchemy.engine.Engine 
CREATE TABLE inpatient (
        pid SERIAL NOT NULL,
        ipid VARCHAR(11) NOT NULL,
        lname VARCHAR(20) NOT NULL,
        fname VARCHAR(20) NOT NULL,
        dob DATE,
        address VARCHAR,
        phone VARCHAR(12) NOT NULL,
        gender VARCHAR(1) NOT NULL,
        PRIMARY KEY (pid)
)


2024-11-14 10:15:37,304 INFO sqlalchemy.engine.Engine [no key 0.01264s] ()
2024-11-14 10:15:37,320 INFO sqlalchemy.engine.Engine 
CREATE TABLE outpatient (
        pid SERIAL NOT NULL,
        opid VARCHAR(11) NOT NULL,
        lname VARCHAR(20) NOT NULL,
        fname VARCHAR(20) NOT NULL,
        dob DATE,
        address VARCHAR,
        phone VARCHAR(12) NOT NULL,
        gender VARCHAR(1) NOT NULL,
        PRIMARY KEY (pid)
)


2024-11-14 10:15:37,320 INFO sqlalchemy.engine.Engine [no key 0.00179s] ()
2024-11-14 10:15:37,320 INFO sqlalchemy.engine.Engine
CREATE TABLE medication (
        medication_id SERIAL NOT NULL,
        name VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
        PRIMARY KEY (medication_id)
)


2024-11-14 10:15:37,335 INFO sqlalchemy.engine.Engine [no key 0.00085s] ()
2024-11-14 10:15:37,335 INFO sqlalchemy.engine.Engine
CREATE TABLE provider (
        pnum SERIAL NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address VARCHAR(255),
        PRIMARY KEY (pnum)
)


2024-11-14 10:15:37,335 INFO sqlalchemy.engine.Engine [no key 0.00097s] ()
2024-11-14 10:15:37,335 INFO sqlalchemy.engine.Engine
CREATE TABLE nurse (
        ecode SERIAL NOT NULL,
        lname VARCHAR(20) NOT NULL,
        fname VARCHAR(20) NOT NULL,
        dob DATE,
        address VARCHAR,
        gender VARCHAR(1) NOT NULL,
        start_date DATE NOT NULL,
        degree_name VARCHAR(100) NOT NULL,
        degree_year INTEGER NOT NULL CHECK (degree_year >= 1900 AND degree_year <= 2100),
        dcode INTEGER NOT NULL,
        PRIMARY KEY (ecode),
        CONSTRAINT fk_nurse_dcode FOREIGN KEY(dcode) REFERENCES department (dcode)
)


2024-11-14 10:15:37,335 INFO sqlalchemy.engine.Engine [no key 0.00180s] ()
2024-11-14 10:15:37,398 INFO sqlalchemy.engine.Engine 
CREATE TABLE phone (
        ecode INTEGER NOT NULL,
        phone_num VARCHAR(12) NOT NULL,
        PRIMARY KEY (ecode, phone_num),
        FOREIGN KEY(ecode) REFERENCES doctor (ecode)
)


2024-11-14 10:15:37,414 INFO sqlalchemy.engine.Engine [no key 0.00326s] ()
2024-11-14 10:15:37,414 INFO sqlalchemy.engine.Engine
CREATE TABLE examination (
        sid SERIAL NOT NULL,
        fee NUMERIC(10, 2) NOT NULL CHECK (fee > 0),
        e_date DATE NOT NULL,
        diagnosis VARCHAR(200),
        next_exam_date DATE,
        pid INTEGER NOT NULL,
        did INTEGER NOT NULL,
        med_f BOOLEAN NOT NULL,
        PRIMARY KEY (sid),
        CONSTRAINT fk_examination_pid FOREIGN KEY(pid) REFERENCES outpatient (pid),
        CONSTRAINT fk_examination_did FOREIGN KEY(did) REFERENCES doctor (ecode)
)


2024-11-14 10:15:37,414 INFO sqlalchemy.engine.Engine [no key 0.00214s] ()
2024-11-14 10:15:37,414 INFO sqlalchemy.engine.Engine
CREATE TABLE effect (
        m_id INTEGER NOT NULL,
        effect VARCHAR(100) NOT NULL,
        PRIMARY KEY (m_id, effect),
        CONSTRAINT fk_effect_m_id FOREIGN KEY(m_id) REFERENCES medication (medication_id)
)


2024-11-14 10:15:37,414 INFO sqlalchemy.engine.Engine [no key 0.00148s] ()
2024-11-14 10:15:37,425 INFO sqlalchemy.engine.Engine
CREATE TABLE batch (
        batch_id SERIAL NOT NULL,
        imported_date DATE NOT NULL,
        provider_num INTEGER NOT NULL,
        PRIMARY KEY (batch_id),
        FOREIGN KEY(provider_num) REFERENCES provider (pnum)        
)


2024-11-14 10:15:37,425 INFO sqlalchemy.engine.Engine [no key 0.00120s] ()
2024-11-14 10:15:37,432 INFO sqlalchemy.engine.Engine 
CREATE TABLE admission (
        pid INTEGER NOT NULL,
        date_of_adm DATE NOT NULL,
        date_of_disc DATE,
        room VARCHAR(10) NOT NULL,
        diagnosis VARCHAR(200),
        fee NUMERIC(10, 2) CHECK (fee > 0),
        nurse_id INTEGER NOT NULL,
        PRIMARY KEY (pid, date_of_adm),
        CONSTRAINT fk_admission_pid FOREIGN KEY(pid) REFERENCES inpatient (pid),
        FOREIGN KEY(nurse_id) REFERENCES nurse (ecode)
)


2024-11-14 10:15:37,432 INFO sqlalchemy.engine.Engine [no key 0.00170s] ()
2024-11-14 10:15:37,432 INFO sqlalchemy.engine.Engine
CREATE TABLE contains (
        batch_id INTEGER NOT NULL,
        m_id INTEGER NOT NULL,
        imported_price NUMERIC(10, 2) NOT NULL CHECK (imported_price > 0),
        imported_quantity INTEGER NOT NULL CHECK (imported_quantity > 0),
        exp_date DATE NOT NULL,
        exp_flag BOOLEAN NOT NULL,
        PRIMARY KEY (batch_id, m_id),
        CONSTRAINT fk_contains_batch_id FOREIGN KEY(batch_id) REFERENCES batch (batch_id),
        CONSTRAINT fk_contains_m_id FOREIGN KEY(m_id) REFERENCES medication (medication_id)
)


2024-11-14 10:15:37,432 INFO sqlalchemy.engine.Engine [no key 0.00207s] ()
2024-11-14 10:15:37,432 INFO sqlalchemy.engine.Engine
CREATE TABLE treat (
        did INTEGER NOT NULL,
        sid INTEGER NOT NULL,
        pid INTEGER NOT NULL,
        date_of_adm DATE NOT NULL,
        PRIMARY KEY (did, sid, pid, date_of_adm),
        CONSTRAINT fk_treat_pid_date_of_adm FOREIGN KEY(pid, date_of_adm) REFERENCES admission (pid, date_of_adm),
        CONSTRAINT fk_treat_did FOREIGN KEY(did) REFERENCES doctor (ecode),
        CONSTRAINT fk_treat_sid FOREIGN KEY(sid) REFERENCES treatment (sid)
)
