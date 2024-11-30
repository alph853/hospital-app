import { useState } from 'react';
import styles from '@/styles/SearchDoctor.module.scss'; 
import {Doctor} from '@/entities';
import InfoGrid from '@/components/InfoGrid';
import QuickFind from '@/components/QuickFind';
import { Doctors } from '@/utils/SampleData';
import { routes } from '@/utils';
function SearchDoctor() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchDoctor = async (search: string) => {
    if (!search) {
      setError('Please enter a search term');
      return;
    }
    setError('');
    setLoading(true);

    const res = await fetch(routes.doctorSearch, {
      method: 'POST',
      body: JSON.stringify({}),
      credentials: "include"
    })
    setLoading(false)

    if (res.ok) {
      const data = await res.json()
      setDoctors(data)
      return
    }
    setError("Something went wrong")
  }
  return (
    <div className={styles.container}>
      <QuickFind onSubmit={searchDoctor} placeholder={"Enter ID/Name"}/>
      {error && <div className={styles.error}>{error}</div>}
      {loading && <div className={styles.loading}>Loading...</div>}
      {!loading && !error && doctors.length > 0 && 
        <InfoGrid entities={doctors} rows={10} />
      }
    </div>
  );
}

export default SearchDoctor;