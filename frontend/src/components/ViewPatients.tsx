import { useState } from "react";
import { Patient } from "@/entities";
import QuickFind from "@/components/QuickFind";
import InfoGrid from "@/components/InfoGrid";
import styles from '@/styles/ViewPatients.module.scss';
function ViewPatients({patients}: {patients: Patient[]}) {
    const [displayedPatients, setDisplayedPatients] = useState<Patient[]>(patients);
    const searchPatient = async (search: string) => {
        if (!search) {
            setDisplayedPatients(patients);
            return;
        }
        const result = patients.filter((patient) => {
            return patient.pid.toString().includes(search) || patient.fname.toLowerCase().includes(search.toLowerCase()) || patient.lname.toLowerCase().includes(search.toLowerCase());
        });
        setDisplayedPatients(result);
    }
    return (
        <div className={styles.container}>
            <div className={styles.search}>
                <QuickFind onSubmit={searchPatient} placeholder={"Enter ID/Name"}/>
            </div>
            {displayedPatients.length > 0 && (
                <InfoGrid entities={displayedPatients} rows={5} />
            )}
        </div>
    );
}

export default ViewPatients;