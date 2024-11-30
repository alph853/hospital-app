export function DatetoString(date: Date) {
    return date.toLocaleDateString('en-GB', {timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit'});
}

const url = import.meta.env.VITE_BACKEND_URL;

export const routes = {
    login:  url+'/api/v1/login',
    doctorSearch:  url+'/api/v1/doctor',
    getDoctorById: url+'/api/v1/doctor', // return doctor info only without their patients
    getDoctorPatients:  url+'/api/v1/doctor', //return array of patients with treatments and examinations
    patientSearch:  url+'/api/v1/search', // return array of patients with treatments and examinations
    patientAdd:  url+'/api/v1/add',
    getPatientById: url+'/api/v1/patient', // return patient with treatments and examinations
    getPatientMeds:  url+'/api/v1/med', // array of receipts (check the type in /entities/index.ts)
    countPatientandDoctors: url+'/api/v1/count' // count doctors and patients, return {doctors: number, patients: number}
}

