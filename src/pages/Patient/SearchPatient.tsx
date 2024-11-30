import {useState} from 'react';
import { Patient } from '@/entities';
import QuickFind from '@/components/QuickFind';
import InfoGrid from '@/components/InfoGrid';
import { patients as samplePatients } from '@/utils/SampleData';
import { routes } from '@/utils';
import { Link } from 'react-router-dom';
import styles from '@/styles/SearchPatient.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
function SearchPatient() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchPatient = async (search: string) => {
    if (!search) {
      setError('Please enter a search term');
      return;
    }
    setError('');
    
    // const res = await fetch(routes.patientSearch, {
    //   method: 'POST',
    //   body: JSON.stringify({}),
    //   credentials: "include"
    // })
    // setLoading(false)
    // if (res.ok) {
    //   const data = await res.json()
    //   setPatients(data)
    //   return;
    // }

    // setError("You're wrong")
    setPatients(samplePatients)
    
  };
    return (
      <div className={styles.container}>
        <div className={styles.header}>
        <QuickFind onSubmit={searchPatient} placeholder={"Enter ID/Name"}/>
        
        <Link to="/patient/add" className={styles.add}><FontAwesomeIcon icon={faPlusCircle}/> Add Patient</Link>
        </div>
        {loading && <h1>Loading...</h1>}
        {error && <h1>{error}</h1>}
        {!loading && !error && patients.length > 0 && <InfoGrid entities={patients} rows={10}/>}
      </div>
    );
}

export default SearchPatient;