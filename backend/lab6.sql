@"D:\HK241\Database\Company DB.sql"


select pnumber from project where plocation = 'Houston';


select essn, fname,minit, lname from (select essn from works_on where pno in (select pnumber from project where plocation = 'Houston')
group by essn having count(essn)= (select count(*) from project where plocation = 'Houston')),employee where essn = ssn;

-- view a 
create or replace view P_Houston_Info as 
select ssn, fname || ' ' || lname as name, pno, pname, hours
from employee join works_on on employee.ssn = works_on.essn 
join project on pnumber = pno where plocation = 'Houston';

select * from P_Houston_Info;

--view b
create or replace view employee_dependent as 
select ssn, fname || ' ' || lname as name, count(*) as no_dependent from 
employee join dependent on ssn = essn group by ssn, fname || ' ' || lname having count(*)>2;
select * from EMPLOYEE_DEPENDENT;

--view c
create or replace view employee_july as 
select fname || ' ' || lname as name, bdate, sex from 
employee where extract(month from bdate) = 7 with read only;

select * from employee_july;
revoke all privileges on employee_july from public;
grant select on employee_july to C##HOME;




-- trigger 

-- trigger a
CREATE OR REPLACE TRIGGER employee_age_trigger
BEFORE INSERT OR UPDATE 
ON employee
FOR EACH ROW
BEGIN
    IF EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM :NEW.bdate) <= 18 THEN
        RAISE_APPLICATION_ERROR(-20005, 'Employee age must be greater than 18');
    END IF;
END employee_age_trigger;

--function b 

create or replace function total_project 
(eid in employee.ssn%type)
return number 
as no_project number :=0;
begin 
    select count(pno) into no_project 
    from works_on 
    where essn = eid;
    return no_project;
end total_project;

select total_project('123456789') from dual;

-- procedure c 

SET SERVEROUTPUT ON;
create or replace procedure show_employee 
as 
begin 
    for emp in (select ssn, fname || ' ' || minit || ' ' || lname as fullname,
    dname, salary from employee join department on dno = dnumber) loop  
        DBMS_OUTPUT.PUT_LINE('SSN: ' || emp.ssn || 
                             ', Full Name: ' || emp.fullname || 
                             ', Department: ' || emp.dname || 
                             ', Salary: ' || emp.salary);
        end loop;
end show_employee;

exec show_employee;


-- procedure e 
SET SERVEROUTPUT ON
create or replace procedure show_sal_level 
as 
begin 
    for emp in (select ssn, fname || ' ' || minit || ' ' || lname as fullname,salary 
    from employee) loop
        declare lv varchar(10);
        begin 
        if emp.salary < 20000 then 
            lv := 'level C';
        elsif emp.salary >=20000 and emp.salary <= 50000 then 
            lv := 'level B';
        else lv := 'level A';
        end if;
        DBMS_OUTPUT.PUT_LINE('SSN: ' || emp.ssn || 
                             ', Full Name: ' || emp.fullname || 
                             ', Salary level: ' || lv);
        end;
    end loop;
end show_sal_level;

exec show_sal_level;

-- trigger d
create table salary_log (
    ssn varchar(9) ,
    content varchar(100) not null,
    ldate date not null,
    primary key(ssn,content)
);

create or replace trigger update_sal_log_trigger 
after 
update of salary on employee 
for each row 
begin 
    if :new.salary > 50000 then 
        insert into salary_log values(:old.ssn,'SALARY UPDATED FROM ' || :old.salary || ' TO '||:new.salary,current_date);
    end if;
end;

create or replace trigger insert_sal_log_trigger 
after 
insert on employee 
for each row 
begin 
    if :new.salary > 50000 then 
        insert into salary_log values(:new.ssn,'SALARY INSERTED ' || :new.salary ,current_date);
    end if;
end;

insert into employee values('John','B','Smith','132456789','09-JAN-65','731 Fondren, Houston, TX','M',60000,'333445555',5);
update employee set salary = 65000 where ssn = '132456789';
