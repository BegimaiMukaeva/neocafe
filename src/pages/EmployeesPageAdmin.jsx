import React from 'react';
import styles from '../styles/MenuAdminPage.module.css';
import SidebarAdmin from "../components/SidebarAdmin/SidebarAdmin";
import EmployeesSearchAdmin from '../components/employees/EmployeesSearchAdmin/EmployeesSearchAdmin';
import StaffTablePage from '../components/employees/StaffTablePage/StaffTablePage';

const EmployeesPageAdmin = () => {
    return (
        <div className={styles.main}>
            <div>
                <SidebarAdmin />
            </div>
            <div className={styles.searchMenu}>
                <EmployeesSearchAdmin />
                <StaffTablePage />
            </div>
        </div>
    );
};

export default EmployeesPageAdmin;