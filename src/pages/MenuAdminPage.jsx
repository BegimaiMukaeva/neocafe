import React from 'react';
import SidebarAdmin from "../components/SidebarAdmin/SidebarAdmin";
import SearchMenuAdmin from "../components/SearchMenuAdmin/SearchMenuAdmin";
import TableAdminPage from '../components/TableAdminPage/TableAdminPage';
import styles from '../styles/MenuAdminPage.module.css';

const MenuAdminPage = () => {
    return (
        <div className={styles.main}>
            <div>
                <SidebarAdmin />
            </div>
            <div>
                <SearchMenuAdmin />
                <TableAdminPage />
            </div>
        </div>
    );
};

export default MenuAdminPage;