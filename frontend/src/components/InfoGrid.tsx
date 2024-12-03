import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Patient, Doctor } from '@/entities';
import styles from '@/styles/InfoGrid.module.scss';
import { DatetoString, parseID } from '@/utils';

function InfoGrid({ entities, rows }: { entities: Patient[] | Doctor[], rows: number }) {
  const [currentPage, setCurrentPage] = useState(1);
  const entitiesPerPage = rows;

  // Calculate the indices for slicing the entities array
  const indexOfLastEntity = currentPage * entitiesPerPage;
  const indexOfFirstEntity = indexOfLastEntity - entitiesPerPage;
  const currentEntities = entities.slice(indexOfFirstEntity, indexOfLastEntity);

  // Calculate the total number of pages
  const totalPages = Math.ceil(entities.length / entitiesPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  const isPatient = (entity: Doctor|Patient): entity is Patient => {
    return (entity as Doctor).dtitle == undefined;
  };

//   const isDoctor = (entity: Doctor|Patient): entity is Doctor => {
//     return (entity as Doctor).dtitle !== undefined;
//   };
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
    <div className={styles.search}>
      <div className={styles.header}>
        <div>ID</div>
        <div>Name</div>
        <div>{isPatient(entities[0]) ? "Date of birth": "Major"}</div>
        <div>Gender</div>
        <div></div>
      </div>
      {currentEntities.map((entity: Doctor|Patient) => {
        if (isPatient(entity)) {
            return (
                <div key={entity.pid} className={styles.result}>
                  <div>{parseID(entity.pid)}</div>
                  <div>{entity.lname} {entity.fname}</div>
                  <div>{DatetoString(entity.dob)}</div>
                  <div>{entity.gender}</div>
                  <Link to={`/patient/${entity.pid}`} state={{ patientData: entity }}>View</Link>
                </div>
              )
        }
        return (
            <div key={entity.ecode} className={styles.result}>
            <div>{entity.ecode}</div>
            <div>{entity.lname} {entity.fname}</div>
            <div>{entity.dtitle}</div>
            <div>{entity.gender}</div>
            <Link to={`/doctor/${entity.ecode}`} state={{doctorData: entity}}>View</Link>
          </div>
        )
      })}
      <div className={styles.pagination}>
        {renderPaginationButtons()}
      </div>
    </div>
  );
}

export default InfoGrid;