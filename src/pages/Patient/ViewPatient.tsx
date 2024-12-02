import { useLocation, useParams} from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Patient, Service, Examination, Treatment, Receipt } from "@/entities";
import ViewServices from "@/components/ViewServices";
import ViewReceipt from "@/components/ViewReceipt";
import { DatetoString, routes } from "@/utils";
import styles from '@/styles/ViewDoctor.module.scss';
import useAuth from "@/hooks/useAuth";


function mixAndSortServices(treatments: Treatment[], examinations: Examination[]): Service[] {
  const services = [...treatments, ...examinations];
  const today = new Date();
  services.sort((a, b) => {
    const dateA = new Date((a as Treatment).start_date || (a as Examination).e_date);
    const dateB = new Date((b as Treatment).start_date || (b as Examination).e_date);
    return Math.abs(today.getTime() - dateA.getTime()) - Math.abs(today.getTime()-dateB.getTime());
  });
  console.log(services);
  return services;
}

function ViewPatient() {
  useAuth()
  const [patient, setPatient] = useState<Patient|null>(null);
  const {patientId} = useParams();
  const location = useLocation();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt|undefined>(undefined)
  const [selectedService, setSelectedService] = useState<number|null>(null)
  const receipts = useRef<Receipt[]>([]);
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (location.state) {
      const {patientData} = location.state as {patientData: Patient};
      setPatient(patientData);
      return;
    }
    if (!patientId) {
      setError('Patient not found');
      return;
    }
    setLoading(true);
    const promise1 = (async () => {
      setError('');
      const {url, options} = routes.getPatientById(parseInt(patientId));
      const res = await fetch(url, options);
      if (res.ok) {
        const data = await res.json()
        setPatient(data)
        return;
      }
      setLoading(false);
      setError('Getting patient went wrong')
    })();

    const promise2 = (async () => {
      setError('');
      const {url, options} = routes.getMedInfoById(parseInt(patientId));
      const res = await fetch(url, options);
      if (res.ok) {
        const data = await res.json()
        receipts.current = data
        return;
      }
      setError('Getting med info went wrong')
    })();

    Promise.all([promise1, promise2]).then(() => {
      setLoading(false);
    })

  },[patientId])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (containerRef.current && target.tagName !== 'INPUT' && target.tagName !== 'BUTTON' && target.tagName !== 'A') {
        setSelectedReceipt(undefined);
        setSelectedService(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef]);

  const handleClick= async (service: Service) => {
    const receipt = receipts.current.find((receipt: Receipt)=> receipt.sid===service.sid)
    if (!receipt) console.log("No receipt")
    console.log(receipt)
    setSelectedReceipt(receipt)
    setSelectedService(service.sid)
  }

    return (
      <div className={styles.container} ref={containerRef}>
        {loading && <h1>Loading...</h1>}
        {error && <h1>{error}</h1>}
        {!loading && !error && patient && (
          <>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
          <div className={styles.info}>
            <h1>{patient.fname} {patient.lname}</h1>
            <div>
            <h2>Code:</h2>
            <p>{patient.pid}</p>
          </div>
          <div>
            <h2>Date of Birth:</h2>
            <p>{DatetoString(patient.dob)}</p>
          </div>
          <div>
            <h2>Gender:</h2>
            <p>{patient.gender}</p>
          </div>
          <div>
            <h2>Address:</h2>
            <p>{patient.address}</p>
          </div>
          <div>
            <h2>Phone:</h2>
            <p>{patient.phone}</p>
          </div>
            <div>
              <h2>Services:</h2>
              <p>{patient.treatments.length > 0 && `${patient.treatments.length} treament` + (patient.treatments.length > 1 ? 's':"")}{patient.treatments.length > 0 && patient.examinations.length > 0 && ", "}{patient.examinations.length > 0 && `${patient.treatments.length} examination`+(patient.examinations.length > 1 ? "s":"")}{patient.examinations.length == 0 && patient.treatments.length == 0 && "0"}</p>
            </div>
          </div>
          {selectedReceipt && <ViewReceipt receipt={selectedReceipt}/>}
          </div>
            <ViewServices selectedService={selectedService} services={mixAndSortServices(patient.treatments, patient.examinations)} onClick={handleClick} rows={5}/>
          </>
        )}
      </div>
    );
}

export default ViewPatient;