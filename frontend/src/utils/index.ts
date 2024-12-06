export function DatetoString(date: Date) {
  if (date == null) return
  return date.toString()
}

export function isTokenExpired(name: string): boolean {
  const token = localStorage.getItem(name)
  if (!token) return true
  const exp = JSON.parse(atob(token.split(".")[1])).exp
  return Date.now() >= exp * 1000
}

export async function refreshToken() {
  if (isTokenExpired("refresh_token")) return false
  const refreshToken = localStorage.getItem("refresh_token")!
  const { url, options } = await routes.refreshToken()
  if (!options) return false
  options.headers["Authorization"] = `Bearer ${refreshToken}`
  const res = await fetch(url, options)
  if (res.ok) {
    const content = await res.json()
    localStorage.setItem("access_token", content.token)
    return true
  }
  return false
}

const baseUrl = import.meta.env.VITE_BACKEND_URL
const makeOptions = async (method: string, body: any, auth: boolean) => {
  console.log("body", body)
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  }

  if (auth) {
    if (isTokenExpired("access_token")) {
      const res = await refreshToken()
      if (!res) return null
    }
    const token = localStorage.getItem("access_token")!
    headers["Authorization"] = `Bearer ${token}`
  }
  if (body === null) {
    return {
      method,
      headers,
      credentials: "include" as RequestCredentials,
    }
  }
  return {
    method,
    body: JSON.stringify(body),
    headers,
    credentials: "include" as RequestCredentials,
  }
}

export const routes = {
  // login
  login: async (email: string, password: string) => ({
    url: `${baseUrl}/api/v1/auth/login`,
    options: await makeOptions("POST", { email, password }, false),
  }),
  refreshToken: async () => ({
    url: `${baseUrl}/api/v1/auth/refresh_token`,
    options: await makeOptions("GET", null, false),
  }),
  // log out
  logout: async () => ({
    url: `${baseUrl}/api/v1/auth/logout`,
    options: await makeOptions("GET", null, true),
  }),
  // search doctor
  doctorSearch: async (ecode: number, fname: string, lname: string, phone: string) => ({
    url: `${baseUrl}/api/v1/doctor/search`,
    options: await makeOptions("POST", { ecode, fname, lname, phone }, true),
  }),

  // get doctor by id
  getDoctorById: async (ecode: number) => ({
    url: `${baseUrl}/api/v1/doctor/${ecode}`,
    options: await makeOptions("GET", null, true),
  }),
  // return array of patients with treatments and examinations
  getPatientsByDoctor: async (ecode: number) => ({
    url: `${baseUrl}/api/v1/doctor/get_treated_patients/${ecode}`,
    options: await makeOptions("GET", null, true),
  }),
  // return array of patients with treatments and examinations
  patientSearch: async (pid: number, fname: string, lname: string, phone: string) => ({
    url: `${baseUrl}/api/v1/patient/search`,
    options: await makeOptions("POST", { pid, fname, lname, phone }, true),
  }),

  AddNewPatient: async (
    fname: string,
    lname: string,
    dob: Date,
    type: string, // type = 0 : outpatient, type = 1 : inpatient
    address: string,
    phone: string,
    gender: string
  ) => ({
    url: `${baseUrl}/api/v1/patient/add_new_patient`,
    options: await makeOptions(
      "POST",
      {
        fname,
        lname,
        dob,
        type: type === "OP" ? 0 : 1,
        address,
        phone,
        gender,
      },
      true
    ),
  }),

  AddVisitedPatient: async (
    pid: number,
    type: string,
    address: string,
    phone: string
  ) => ({
    url: `${baseUrl}/api/v1/patient/add_existed_patient`,
    options: await makeOptions(
      "POST",
      {
        pid,
        type: type === "OP" ? 0 : 1,
        address: address === "" ? null : address,
        phone: phone === "" ? null : phone,
      },
      true
    ),
  }),
  // return patient with treatments and examinations
  getPatientById: async (id: number) => ({
    url: `${baseUrl}/api/v1/patient/id/${id}`,
    options: await makeOptions("GET", null, true),
  }),
  // count doctors and patients, return {doctors: number, patients: number}
  countPatientandDoctors: async () => ({
    url: `${baseUrl}/api/v1/hospital/count`,
    options: await makeOptions("GET", null, true),
  }),

  getMedInfoById: async (pid: number) => ({
    url: `${baseUrl}/api/v1/patient/medication_info/${pid}`,
    options: await makeOptions("GET", null, true),
  }),
  getAllDepartments: async () => ({
    url: `${baseUrl}/api/v1/hospital/departments`,
    options: await makeOptions("GET", null, true),
  }),

  getDoctorsByDepartment: async (dtitle: string) => ({
    url: `${baseUrl}/api/v1/doctor/get_doctor_department/${dtitle}`,
    options: await makeOptions("GET", null, true),
  }),

  addExamination: async (
    pid: number,
    did: number,
    fee: number,
    e_date: Date,
    diagnosis: string,
    next_exam_date: Date
  ) => ({
    url: `${baseUrl}/api/v1/patient/add_examination`,
    options: await makeOptions(
      "POST",
      { pid, did, fee, e_date, diagnosis, next_exam_date },
      true
    ),
  }),
  AddAdmission: async (
    pid: number,
    nurse_id: number,
    fee: number,
    start_date: Date,
    room: string,
    diagnosis: string
  ) => ({
    url: `${baseUrl}/api/v1/patient/add_admission`,
    options: await makeOptions(
      "POST",
      {
        pid,
        nurse_id,
        fee,
        date_of_adm: start_date,
        room,
        diagnosis,
      },
      true
    ),
  }),
  getNursesByDepartment: async (dtitle: string) => ({
    url: `${baseUrl}/api/v1/doctor/get_nurse_department/${dtitle}`,
    options: await makeOptions("GET", null, true),
  }),

  getPatientTypes: async (pid: number) => ({
    url: `${baseUrl}/api/v1/patient/type/${pid}`,
    options: await makeOptions("GET", null, true),
  }),
}

function isNumeric(value: string): boolean {
  return /^\d+$/.test(value)
}
function isAlphabetic(value: string): boolean {
  return /^[A-Za-z]+$/.test(value)
}
export function parseSearch(
  search: string
): { id: number; fname: string; lname: string, phone: string } | null {
  if (search.includes("p:")) {
    const match = search.match(/p:(\d{1,10})/);
    if (match) {
      return { id: 0, fname: "", lname: "", phone: match[1] };
    }
    return null;
  }
  if (search.startsWith("OP") || search.startsWith("IP")) {
    search = search.slice(2)
  }
  if (isNumeric(search)) {
    return { id: parseInt(search), fname: "", lname: "", phone: "" }
  }
  if (isAlphabetic(search)) {
    if (search.includes(" ")) {
      const [fname, lname] = search.split(" ")
      return { id: 0, fname, lname, phone: "" }
    } else {
      return { id: 0, fname: search, lname: "", phone: "" }
    }
  }
  return null
}

export function parseID(pid: number) {
  return pid.toString().padStart(9, "0")
}
