import useAuth from "@/hooks/useAuth";
import { routes } from "@/utils";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import doctorImage from '@/assets/doctor.png'
import patientImage from '@/assets/patient.png'
import medicalCheckupImage from '@/assets/medical-checkup.svg'
import styles from '@/styles/Dashboard.module.scss'
function Dashboard() {
    const [isLoggedIn, _] = useAuth()
    const [numDoctors, setNumDoctors] = useState(0)
    const [numPatients, setNumPatients] = useState(0)
    if (!isLoggedIn) {
        return <Navigate to="/login" />
    }
    useEffect(() => {
        (async () => {
            const res = await fetch(routes.countPatientandDoctors)
            if (res.ok) {
                const data = await res.json()
                setNumDoctors(data.doctors)
                setNumPatients(data.patients)
            }
        })();
    },[])
    return (
        <div className={styles.dashboard}>
            <div className={styles.top}>
                <div className={styles.card}>
                    <div >Welcome back</div>
                    <div style={{fontWeight: "800", fontSize: "3em"}}>Manager</div>
                </div>
                <div className={styles.overview}>
                    <div className={styles.overviewText}>Overview</div>
                    <div className={styles.summary}>
                        <img src={doctorImage} alt="doctor" />
                        <div className={styles.info}>
                            <div className={styles.count}>{numDoctors}</div>
                            <div className={styles.countText}>{numDoctors > 1? "doctors": "doctor" + " in department"}</div>
                        </div>
                    </div>
                    <div className={styles.summary}>
                        <img src={patientImage} alt="patient" />
                        <div className={styles.info}>
                            <div className={styles.count}>{numPatients}</div>
                            <div className={styles.countText}>{numPatients > 1? "patients": "patient" + " in cure"}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.message}>
                <img src={medicalCheckupImage} alt="medical checkup" />
                <div>More than just treating patients</div>
            </div>
        </div>
    )
}

export default Dashboard;