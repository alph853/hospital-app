import { Link } from "react-router-dom";
import { FormEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import styles from '@/styles/AddPatient.module.scss'
import { Patient } from "@/entities";
import { routes } from "@/utils";
import useAuth from "@/hooks/useAuth";
function AddPatient() {
    useAuth()
    const [already, setAlready] = useState(false)
    const [patient, setPatient] = useState<Patient | undefined>(undefined)
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        dob: '',
        type: '',
        pid: '',
        address: '',
        phone: '',
        gender: ''
    })
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        for (const key in formData) {
            if (!already) {
              if (key !== 'pid' && formData[key as keyof typeof formData] === '') {
                alert("Bad")
                return;
              }
            } else {
              if (key != "lname" && key !="fname" && key !="gender" && key !="dob" && formData[key as keyof typeof formData] === '') {
                alert("Bad")
                return;
              }
            }
        }
        
        if (already) {
            const { url, options } = routes.AddVisitedPatient(parseInt(formData.pid), formData.type, formData.address, formData.phone);
            const res = await fetch(url, options);
            if (res.ok) {
                const data = await res.json()
                setPatient(data)
                alert("Patient added")
                return;
            }
            alert("Failed to add patient")
            return;
        }

        const { url, options } = routes.AddNewPatient(formData.fname, formData.lname, new Date(formData.dob), formData.type, 
                                                    formData.address, formData.phone, formData.gender);
        const res = await fetch(url, options);
        if (res.ok) {
            const data = await res.json()
            setPatient(data)
            alert("Patient added")
            return;
        }
        alert("Failed to add patient")
    }
    return (
        <div className={styles.container}>
            <div className={styles.buttons}>
                <Link to="/patient">Back</Link>
                <button form="addPatient"><FontAwesomeIcon icon={faPlusCircle}/>Add patient</button>
            </div>
            <div className={styles.already}>
                <label>Already have a PID?</label>
                <input type="checkbox" checked={already} onChange={() => setAlready(!already)}/>
            </div>
            <form id="addPatient" onSubmit={handleSubmit}>
                {!already && <><div>
                    <label>Name</label>
                    <input type="text" value={formData.fname} placeholder="Enter fistname" onChange={(e) => {setFormData((prev) => ({...prev, fname: e.target.value}))}}/>
                    <input type="text" value={formData.lname} placeholder="Enter lastname" onChange={(e) => {setFormData((prev) => ({...prev, lname: e.target.value}))}}/>
                </div>
                <div>
                    <label>Date of birth</label>
                    <input type="date" value={formData.dob} onChange={(e) => {setFormData((prev) => ({...prev, dob:e.target.value}))}}/>
                </div>
                <div>
                    <label>Gender</label>
                    <span>
                        <input type="radio" checked={formData.gender === "Male"} onChange={() => {setFormData((prev)=>({...prev, gender: "Male"}))}}/> Male
                    </span>
                    <span>
                        <input type="radio" checked={formData.gender === "Female"} onChange={() => {setFormData((prev)=>({...prev, gender: "Female"}))}}/> Female
                    </span>
                </div></>}
                {already && <div>
                        <label>Patient ID</label>
                        <input type="text" value={formData.pid} placeholder="Enter patient ID" onChange={(e) => {setFormData((prev) => ({...prev, pid: e.target.value}))}}/>
                    </div>}
                <div>
                    <label>Patient type</label>
                    <span>
                        <input type="radio" checked={formData.type === "OP"} onChange={() => {setFormData((prev)=>({...prev, type: "OP"}))}}/> OP
                    </span>
                    <span>
                        <input type="radio" checked={formData.type=== "IP"} onChange={() => {setFormData((prev)=>({...prev, type: "IP"}))}}/> IP
                    </span>
                </div>
                <div>
                    <label>Address</label>
                    <input type="text" value={formData.address} placeholder="Enter address" onChange={(e) => {setFormData((prev) => ({...prev, address: e.target.value}))}}/>
                </div>
                <div>
                    <label>Phone</label>
                    <input type="text" value={formData.phone} placeholder="Enter phone" onChange={(e) => {setFormData((prev) => ({...prev, phone: e.target.value}))}}/>
                </div>
                {patient && <Link to={`/patient/${patient.pid}`}>View info</Link>}
            </form>
        </div>
    )
}

export default AddPatient;