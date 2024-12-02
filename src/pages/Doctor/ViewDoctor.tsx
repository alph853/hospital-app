import { useParams, useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import { Doctor, Patient } from "@/entities";
import ViewPatients from "@/components/ViewPatients";
import { DatetoString, routes } from "@/utils";
import styles from '@/styles/ViewDoctor.module.scss';
import useAuth from "@/hooks/useAuth";
function ViewDoctor() {
    useAuth()
    const { doctorId } = useParams();
    const location = useLocation();
    const [doctor, setDoctor] = useState<Doctor|null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        if (location.state) {
          const { doctorData } = location.state as { doctorData: Doctor };
          console.log("Has data", doctorData)
          setDoctor(doctorData);

          (async () => {
            setLoading(true);
            const { url, options } = routes.getPatientsByDoctor(doctorData.ecode);
            const res = await fetch(url, options);
            if (res.ok) {
              const data = await res.json()
              setPatients(data)
              setLoading(false)
              return;
            }
            setError('Something went wrong')
            setLoading(false)
          })();

          return;
        }
        console.log("No data")
        if (!doctorId) {
          setError('Doctor not found');
          return;
        }
        setLoading(true);
        setError('');

        const promise1 = (async () => {
          const { url, options } = routes.getDoctorById(parseInt(doctorId));
          const res = await fetch(url, options);
          if (res.ok) {
            const data = await res.json()
            setDoctor(data)
            return;
          }
          setError('Something went wrong')
        })();

        const promise2 = (async () => {
          const { url, options } = routes.getPatientsByDoctor(parseInt(doctorId));
          const res = await fetch(url, options);
          if (res.ok) {
            const data = await res.json()
            setPatients(data)
            return;
          }
        })();

        Promise.all([promise1, promise2]).then(() => {setLoading(false)})

    }, [doctorId]);
    return (
      <div className={styles.container}>
        {loading && <h1>Loading...</h1>}
        {error && <h1>{error}</h1>}
        {!loading && !error && doctor && (
          <>
          <div className={styles.info}>
            <div>
              <h1>{doctor.fname} {doctor.lname}</h1>
            </div>
            <div>
              <h2>Code:</h2>
              <p>{doctor.ecode}</p>
            </div>
            <div>
              <h2>Department:</h2>
              <p>{doctor.dtitle}</p>
            </div>
            <div>
              <h2>Date of birth:</h2>
              <p>{doctor.dob ? DatetoString(doctor.dob): "N/A"}</p>
            </div>
            <div>
              <h2>Gender:</h2>
              <p>{doctor.gender}</p>
            </div>
            <div>
              <h2>Address:</h2>
              <p>{doctor.address}</p>
            </div>
            <div>
              <h2>Start date</h2>
              <p>{DatetoString(doctor.start_date)}</p>
            </div>
            <div>
              <h2>Degree name:</h2>
              <p>{doctor.degree_name}</p>
            </div>
            <div>
              <h2>Degree year:</h2>
              <p>{doctor.degree_year}</p>
            </div>
            <div>
              <h2>Number of patients:</h2>
              <p>{patients.length}</p>
            </div>
          </div>
          <ViewPatients patients={patients} />
          </>
        )}
      </div>
    );
}

export default ViewDoctor;