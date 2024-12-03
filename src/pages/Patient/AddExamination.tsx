import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import styles from '@/styles/AddPatient.module.scss'
import { routes } from "@/utils";
import useAuth from "@/hooks/useAuth";
import { Doctor } from "@/entities";

function formatCurrency(value: string) {
    let numericValue = value.replace(/\D/g, ''); 
    numericValue = numericValue.replace(/^0+/, '');
    if (numericValue === '') return '0';
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function AddExamination() {
    useAuth()
    const {patientId} = useParams();
    const [success, setSuccess] = useState(false)
    const [departments, setDepartments] = useState<string[]>([])
    const [doctors, setDoctors] = useState<{ecode: number, dtitle: string, name: string}[]>([])
    const [loading, setLoading] = useState(false)
    const [doctorLoading, setDoctorLoading] = useState(false)
    const [formData, setFormData] = useState({
        fee: '0',
        e_date: '',
        diagnosis: '',
        next_exam_date: '',
        department: '',
        doctor: {ecode: '', name: ''},
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!patientId || formData.fee === '' || formData.e_date === '' || formData.diagnosis === '' || formData.next_exam_date === '' || formData.department === '' || formData.doctor.ecode === '') {
            alert("Please fill all fields")
            return;
        }
        
        const { url, options } = routes.addExamination(parseInt(patientId), parseInt(formData.doctor.ecode), 
        parseInt(formData.fee.replace(/\D/g, '')), new Date(formData.e_date), formData.diagnosis, new Date(formData.next_exam_date))
        const res = await fetch(url, options)
        if (res.ok) {
            setSuccess(true)
            return;
        }
        alert("Failed to add examination")
    }

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
    
    return (
        <div className={styles.container}>
            <div className={styles.buttons}>
                <Link to={`/patient/${patientId}`}>Back</Link>
                <button form="add"><FontAwesomeIcon icon={faPlusCircle}/>Add Examination</button>
            </div>
            <form id="add" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fee">Fee</label>
                    <input type="text" id="fee" value={formData.fee} onChange={(e) => setFormData({...formData, fee: formatCurrency(e.target.value)})}/>
                </div>
                <div>
                    <label htmlFor="e_date">Date</label>
                    <input type="date" id="e_date" value={formData.e_date} onChange={(e) => setFormData({...formData, e_date: e.target.value})}/>
                </div>
                <div>
                    <label htmlFor="diagnosis">Diagnosis</label>
                    <input type="text" id="diagnosis" value={formData.diagnosis} onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}/>
                </div>
                <div>
                    <label htmlFor="next_exam_date">Next Examination Date</label>
                    <input type="date" id="next_exam_date" value={formData.next_exam_date} onChange={(e) => setFormData({...formData, next_exam_date: e.target.value})}/>
                </div>
                {loading ? <div>Loading...</div> : <div>
                    <label htmlFor="department">Doctor</label>
                    <Select className={styles.select} value={{value: formData.department, label: formData.department}} options={departments.map((department) => ({value: department, label: department}))} onChange={(e) => setFormData({...formData, department: e ? e.value : ''})}/>
                    {doctorLoading ? <div>Loading...</div> : <Select className={styles.select} value={{value: formData.doctor.ecode, label: formData.doctor.ecode === "" ? "":`${formData.doctor.ecode} - ${formData.doctor.name}`}} options={doctors.map((doctor) => ({value: doctor.ecode.toString(), label: `${doctor.ecode} - ${doctor.name}`}))} onChange={(e) => setFormData({...formData, doctor: e ? {ecode: e.value, name: doctors.find(doctor => doctor.ecode.toString()===e.value)!.name}: {ecode: '', name: ''}})}/>}
                </div>}
                {success && <Link to={`/patient/${patientId}`}>View patient</Link>}
            </form>
        </div>
    );
}

export default AddExamination;