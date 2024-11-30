import { useState } from "react";
import { Patient } from "@/entities";
import QuickFind from "@/components/QuickFind";
import InfoGrid from "@/components/InfoGrid";
import styles from '@/styles/ViewPatients.module.scss';
function ViewPatients({patients}: {patients: Patient[]}) {
    const [displayedPatients, setDisplayedPatients] = useState<Patient[]>(patients);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const searchPatient = async (search: string) => {
        if (!search) {
            setDisplayedPatients(patients);
            return;
        }
        setError('');
        setLoading(true);
        // const res = await fetch(`http://localhost:8000/patients?search=${search}`);
        // const data = await res.json();
        setTimeout(() => {
            const result = patients.filter((patient) => {
                return patient.pid.toString().includes(search) || patient.fname.toLowerCase().includes(search.toLowerCase()) || patient.lname.toLowerCase().includes(search.toLowerCase());
            });
            if (result.length === 0) {
                setError('No patients found');
                setLoading(false);
                return;
            }
            setDisplayedPatients(result);
            setLoading(false);
        },1000);
    }
    return (
        <div className={styles.container}>
            <div className={styles.search}>
                <QuickFind onSubmit={searchPatient} placeholder={"Enter ID/Name"}/>
            </div>
            {loading && <h1>Loading...</h1>}
            {error && <h1>{error}</h1>}
            {!loading && !error && displayedPatients.length > 0 && (
                <InfoGrid entities={displayedPatients} rows={5} />
            )}
        </div>
    );
}

export default ViewPatients;