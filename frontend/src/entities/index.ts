export type Doctor = {
  ecode: number
  lname: string
  fname: string
  dob: Date | null
  address: string
  gender: string
  start_date: Date
  degree_name: string
  degree_year: number
  dcode: number
  dtitle: string
}
export type Treatment = {
  sid: number
  start_date: Date
  end_date: Date | null
  result: string
  recover_f: boolean
  med_f: boolean
  did: { ecode: number; name: string }[]
  pid: number
}

export type Examination = {
  sid: number
  fee: number
  e_date: Date
  diagnosis: string
  next_exam_date: Date | null
  did: { ecode: number; name: string }
  med_f: boolean
}

export type Patient = {
  pid: number
  lname: string
  fname: string
  dob: Date
  address: string
  phone: string
  gender: string
  examinations: Examination[]
  treatments: Treatment[]
}

type Medication = {
  mid: number
  name: string
  quantity: number
  price: number
}

export type Receipt = {
  sid: number
  medication: Medication[]
  total_fee: number
}

export type Service = Examination | Treatment
