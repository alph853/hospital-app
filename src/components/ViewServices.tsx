import { Service, Treatment, Examination } from "@/entities";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import QuickFind from "./QuickFind";
import { DatetoString } from "@/utils";
import styles from '@/styles/InfoGrid.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

function ViewServices({ services, onClick, rows, selectedService }: { services: Service[], onClick: (service: Service) => void, rows: number, selectedService: number|null }) {
  const { patientId } = useParams();
  const [displayedServices, setDisplayedServices] = useState<Service[]>(services);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = rows;

  const isTreatment = (service: Service): service is Treatment => {
    return (service as Treatment).t_fee !== undefined;
  }

  const searchService = async (search: string) => {
    if (!search) {
      setDisplayedServices(services);
      return;
    }
    setTimeout(() => {
      const result = services.filter((service) => {
        return service.sid.toString().includes(search);
      });
      if (result.length === 0) {
        setError('No services found');
        return;
      }
      setDisplayedServices(result);
    }, 1000);
  }

  // Calculate the indices for slicing the displayedServices array
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = displayedServices.slice(indexOfFirstService, indexOfLastService);

  // Calculate the total number of pages
  const totalPages = Math.ceil(displayedServices.length / servicesPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPaginationButtons = () => {
    const maxPageButtons = 5;
    const buttons = [];
    const ellipsis = <span key="ellipsis">...</span>;

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? styles.active : ''}
          >
            {i}
          </button>
        );
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

      if (startPage > 1) {
        buttons.push(
          <button
            key={1}
            onClick={() => handlePageChange(1)}
            className={currentPage === 1 ? styles.active : ''}
          >
            1
          </button>
        );
        if (startPage > 2) {
          buttons.push(ellipsis);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? styles.active : ''}
          >
            {i}
          </button>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttons.push(ellipsis);
        }
        buttons.push(
          <button
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
            className={currentPage === totalPages ? styles.active : ''}
          >
            {totalPages}
          </button>
        );
      }
    }

    return buttons;
  };
  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <QuickFind onSubmit={searchService} placeholder={"Enter ID/Doctor name/Date"} />
        <div className={styles.buttons}>
          <Link to={`/patient/${patientId}/add/treatment`}><FontAwesomeIcon icon={faPlusCircle}/>Add Treatment</Link>
          <Link to={`/patient/${patientId}/add/examination`}><FontAwesomeIcon icon={faPlusCircle}/> Add Examination</Link>
        </div>
      </div>
      {error ? <div>{error}</div> : <div className={styles.search}>
        <div className={styles.header}>
          <div>ID</div>
          <div>Date</div>
          <div>Doctors</div>
          <div>Fee</div>
          <div>Service</div>
        </div>
        {services.length > 0 && currentServices.map((service) => (
          <div key={service.sid} className={`${styles.result} ${styles.hover} ${selectedService === service.sid ? styles.selected : ''}`} onClick={() => { onClick(service)}}>
            <div>{service.sid}</div>
            <div>
              {isTreatment(service) ? (
                <>
                  {DatetoString(service.start_date)}
                  {service.end_date && <strong> - </strong>}
                  {service.end_date && DatetoString(service.end_date)}
                </>
              ) : (
                DatetoString(service.e_date)
              )}
            </div>            <div className={styles.doctors}>{isTreatment(service) ? service.did.map(({ecode: id, name}) => <Link to={`/doctor/${id}`} key={id}>{`${id} - ${name}`}</Link>) : <Link to={`/doctor/${service.did.ecode}`}>{`${service.did.ecode} - ${service.did.name}`}</Link>}</div>
            <div>{isTreatment(service) ? service.t_fee : service.fee}</div>
            <div>{isTreatment(service) ? 'Treatment' : 'Examination'}</div>
          </div>
        ))}
        <div className={styles.pagination}>
          {renderPaginationButtons()}
        </div>
      </div>}
    </div>
  );
}

export default ViewServices;