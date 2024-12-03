import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
import styles from '@/styles/AddPatient.module.scss'
import { routes } from "@/utils";
import useAuth from "@/hooks/useAuth";
import { Doctor } from "@/entities";

function AddAdmission() {
    useAuth()
    const {patientId} = useParams();
    const [departments, setDepartments] = useState<string[]>([])
    const [doctors, setDoctors] = useState<{ecode: number, dtitle: string, name: string}[]>([])
    const [sucess, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [doctorLoading, setDoctorLoading] = useState(false)
    const [formData, setFormData] = useState({
        fee: '',
        start_date: '',
        doctor: {ecode: '', name: ''},
        department: '',
    });
    
    useEffect(() => {
        (async () => {
            setLoading(true)
            const {url, options} = routes.getAllDepartments();
            const res = await fetch(url, options)
            if (res.ok) {
                const data = await res.json()
                setDepartments(data)
            }
            setLoading(false)
        })()
    }, [])
    useEffect(() => {
        (async () => {
            setDoctorLoading(true)
            const {url, options} = routes.getDoctorsByDepartment(formData.department);
            const res = await fetch(url, options)
            if (res.ok) {
                const data = await res.json()
                setDoctors(data.map((doctor: Doctor) => ({ecode: doctor.ecode, dtitle: doctor.dtitle, name: doctor.fname + ' ' + doctor.lname})))
            }
            setDoctorLoading(false)
        })()
        setFormData({...formData, doctor: {ecode: '', name: ''}})
    }, [formData.department])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!patientId || formData.fee === '' || formData.start_date === '' || formData.department === '' || formData.doctor.ecode === '') {
            alert("Please fill all fields")
            return;
        }
        const { url, options } = routes.AddAdmission(parseInt(patientId), parseInt(formData.doctor.ecode), 
        parseInt(formData.fee.replace(/\D/g, '')), new Date(formData.start_date))
        const res = await fetch(url, options)
        if (res.ok) {
            setSuccess(true)
            return;
        }
        alert("Failed to add admission")
    }
    return (
        <div className={styles.container}>
            <div className={styles.buttons}>
                <Link to={`/patient/${patientId}`}>Back</Link>
                <button form="add"><FontAwesomeIcon icon={faPlusCircle}/>Add Examination</button>
            </div>
            <form id="add" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fee">Fee</label>
                    <input type="number" id="fee" value={formData.fee} onChange={(e) => setFormData({...formData, fee: e.target.value})}/>
                </div>
                <div>
                    <label htmlFor="start_date">Date</label>
                    <input type="date" id="start_date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})}/>
                </div>
                {loading ? <div>Loading...</div> :<div>
                    <label htmlFor="department">Department</label>
                    <Select className={styles.select} value={{value: formData.department, label: formData.department}} options={departments.map((department) => ({value: department, label: department}))} onChange={(e) => setFormData({...formData, department: e ? e.value : ''})}/>
                    {doctorLoading ? <div>Loading...</div> : <Select className={styles.select} value={{value: formData.doctor.ecode, label: formData.doctor.ecode === "" ? "":`${formData.doctor.ecode} - ${formData.doctor.name}`}} options={doctors.map((doctor) => ({value: doctor.ecode.toString(), label: `${doctor.ecode} - ${doctor.name}`}))} onChange={(e) => setFormData({...formData, doctor: e ? {ecode: e.value, name: doctors.find(doctor => doctor.ecode.toString()===e.value)!.name}: {ecode: '', name: ''}})}/>}
                </div>}
                {sucess && <Link to={`/patient/${patientId}`}>View patient</Link>}
            </form>
        </div>
    )
}

export default AddAdmission;