import React from 'react';
import styles from '../styles/MenuAdminPage.module.css';
import SidebarAdmin from '../components/SidebarAdmin/SidebarAdmin';
import BranchesSearchAdmin from '../components/branches/BranchesSearchAdmin/BranchesSearchAdmin';
import BranchesTablePage from  '../components/branches/BranchesTablePage/BranchesTablePage';

const BranchesAdminPage = () => {
    return (
        <div className={styles.main}>
            <div>
                <SidebarAdmin />
            </div>
            <div>
                <BranchesSearchAdmin />
                <BranchesTablePage />
            </div>
        </div>
    );
};

export default BranchesAdminPage;