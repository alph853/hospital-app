import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import styles from '@/styles/AddPatient.module.scss'
function AddExamination() {
    const {patientId} = useParams();
    return (
        <div className={styles.container}>
            <div className={styles.buttons}>
                <Link to={`/patient/${patientId}`}>Back</Link>
                <button form="add"><FontAwesomeIcon icon={faPlusCircle}/>Add Examination</button>
            </div>
            <form id="add">

            </form>
        </div>
    );
}

export default AddExamination;