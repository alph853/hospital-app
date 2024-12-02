export function DatetoString(date: Date) {
    return date.toLocaleDateString('en-GB', {timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit'});
}

const baseUrl = import.meta.env.VITE_BACKEND_URL;

export const routes = {
    // login
    login:  (email: string, password: string) => ({
        url: baseUrl+'/api/v1/login', 
        options: {method: 'POST', body: JSON.stringify({email, password}), headers: {'Content-Type': 'application/json'}, credentials: "include" as RequestCredentials}
    }),
    verifyLogin: () => ({
        url: baseUrl+'/api/v1/login',
        options: {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: "include" as RequestCredentials}
    }),
    // search doctor
    doctorSearch:  (ecode: number, fname: string, lname: string) =>
        ({url: baseUrl+'/api/v1/search',
        options: {method: 'POST', body: JSON.stringify({ecode, fname, lname}), headers: {'Content-Type': 'application/json'}, credentials: "include" as RequestCredentials}
    }),
    // get doctor by id
    getDoctorById: (ecode: number) => ({
        url: baseUrl+`/api/v1/doctor/${ecode}`,
        options: {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: "include" as RequestCredentials}
    }),
    //return array of patients with treatments and examinations
    getPatientsByDoctor:  (ecode: number) => ({
        url: baseUrl+'/api/v1/doctor/patients',
        options: {method: 'POST', body: JSON.stringify({ecode}), headers: {'Content-Type': 'application/json'}, credentials: "include" as RequestCredentials}
    }), 
    // return array of patients with treatments and examinations
    patientSearch:  (pid: number, fname: string, lname: string) => ({
        url: baseUrl+'/api/v1/search',
        options: {method: 'POST', body: JSON.stringify({pid, fname, lname}), headers: {'Content-Type': 'application/json'}, credentials: "include" as RequestCredentials}
    }),
    AddNewPatient:  (fname: string, lname: string, dob: Date, type: string, address: string, phone: string, gender: string) => ({
        url: baseUrl+'/api/v1/patient',
        options: {method: 'POST', body: JSON.stringify({fname, lname, dob, type, address, phone, gender}), headers: {'Content-Type': 'application/json'}, credentials: "include" as RequestCredentials}
    }),
    AddVisitedPatient:  (pid: number, type: string, address: string, phone: string) => ({
        url: baseUrl+'/api/v1/patient',
        options: {method: 'POST', body: JSON.stringify({pid, type, address, phone}), headers: {'Content-Type': 'application/json'}, credentials: "include" as RequestCredentials}
    }),
    // return patient with treatments and examinations
    getPatientById: (id: number) => ({
        url: baseUrl+`/api/v1/patient/id/${id}`,
        options: {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: "include" as RequestCredentials}
    }), 
    // count doctors and patients, return {doctors: number, patients: number}
    countPatientandDoctors: () => ({
        url: baseUrl+'/api/v1/count',
        options: {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include' as RequestCredentials}
    }),
    getMedInfoById: (pid: number) => ({
        url: baseUrl+`/api/v1/medication_info/${pid}`,
        options: {method: 'GET',headers: {'Content-Type': 'application/json'}, credentials: 'include' as RequestCredentials}
    }),
    getAllDepartments: () => ({
        url: baseUrl+'/api/v1/departments',
        options: {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include' as RequestCredentials}
    }),
    getDoctorsByDepartment: (dtitle: string) => ({
        url: baseUrl+`/api/v1/doctor/${dtitle}`,
        options: {method: 'GET', headers: {'Content-Type': 'application/json'}, credentials: 'include' as RequestCredentials}
    }),
    addExamination: (pid: number, ecode: number, fee: number, e_date: Date, diagnosis: string, next_exam_date: Date) => ({
        url: baseUrl+'/api/v1/examination',
        options: {method: 'POST', body: JSON.stringify({pid, ecode, fee, e_date, diagnosis, next_exam_date}), headers: {'Content-Type': 'application/json'}, credentials: 'include' as RequestCredentials}
    }),
    AddAdmission: (pid: number, ecode: number, fee: number, start_date: Date) => ({
        url: baseUrl+'/api/v1/treatment',
        options: {method: 'POST', body: JSON.stringify({pid, ecode, fee, start_date}), headers: {'Content-Type': 'application/json'}, credentials: 'include' as RequestCredentials}
    }),
}


function isNumeric(value: string): boolean {
    return /^\d+$/.test(value);
}
function isAlphabetic(value: string): boolean {
    return /^[A-Za-z]+$/.test(value);
}
export function parseSearch(search: string): ({id: number, fname: string, lname: string} | null) {
    if (search.startsWith("OP") || search.startsWith("IP")) {
        search = search.slice(2);
    }
    if (isNumeric(search)) {
        return {id: parseInt(search), fname: '', lname: ''};
    }
    if (isAlphabetic(search)) {
        if (search.includes(" ")) {
            const [fname, lname] = search.split(" ");
            return {id: 0, fname, lname};
        } else {
            return {id: 0, fname: search, lname: ''};
        }
    }
    return null;
}
