import { useState, FormEvent } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import styles from '@/styles/QuickFind.module.scss';

function QuickFind({onSubmit, placeholder}: {onSubmit: (search: string) => Promise<void>, placeholder: string}) {
    const [search, setSearch] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(search);
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
        <label>Quick find</label>
        <div>
          <FontAwesomeIcon icon={faSearch} className={styles.icon}/>
          <input value={search}  onChange={(e) => setSearch(e.target.value)} type="text" placeholder={placeholder}/>
          <button>Find</button>
        </div>
      </form>
    )

}

export default QuickFind;