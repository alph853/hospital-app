// src/components/Layout.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import hospitalImage from '@/assets/hospital.png';
import reportImage from '@/assets/report.png';
import doctorsImage from '@/assets/medical-team.png';
import patientImage from '@/assets/portal.png';
import styles from '@/styles/Layout.module.scss'; // Assuming you have some CSS for styling
import { routes } from '@/utils';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate()
    const handleLogout = async () => {
        const {url, options} = routes.logout()
        const res = await fetch(url, options)
        if (res.ok) {
            navigate('/login')
        }
    }
    return (
        <div className={styles.body}>
            <nav className={styles.navbar}>
                <ul>
                    <li>
                        <img src={hospitalImage} alt="logo" className={styles.logo}/>

                    </li>
                    <li>
                        <NavLink to="/dashboard" style={{backgroundColor: "#015D67"}} className={({ isActive }) => (isActive ? styles.active : '')}>
                            <img src={reportImage} alt="report" />
                            <p>Dashboard</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/doctor" style={{backgroundColor: "#00ACB1"}} className={({ isActive }) => (isActive ? styles.active : '')}>
                            <img src={doctorsImage} alt="doctor" />
                            <p>Doctors</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/patient" style={{backgroundColor: "#87E4db"}} className={({ isActive }) => (isActive ? styles.active : '')}>
                            <img src={patientImage} alt="patient" />
                            <p>Patients & Treatments</p>
                        </NavLink>
                    </li>
                    <li>
                        <button onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
            <main>{children}</main>
        </div>
  );
};

export default Layout;