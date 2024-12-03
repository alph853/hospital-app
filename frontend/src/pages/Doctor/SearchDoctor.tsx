import { useState } from 'react';
import styles from '@/styles/SearchDoctor.module.scss'; 
import {Doctor} from '@/entities';
import InfoGrid from '@/components/InfoGrid';
import QuickFind from '@/components/QuickFind';
import { routes, parseSearch } from '@/utils';
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
function SearchDoctor() {
  useAuth()
  const navigate = useNavigate()
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
    const searchResult = parseSearch(search);
    if (!searchResult) {
      setError('Invalid search term');
      return;
    }
    const { id, fname, lname } = searchResult;
    const { url, options } = await routes.doctorSearch(id, fname, lname);
    if (!options) {
      navigate('/login');
      return;
    }
    const res = await fetch(url, options);

    if (res.ok) {
      const data = await res.json()
      setDoctors(data)
      setLoading(false)
      return
    }
    setError("Something went wrong")
    setLoading(false)
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