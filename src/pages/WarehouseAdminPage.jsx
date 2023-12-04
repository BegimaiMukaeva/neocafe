import React from 'react';
import SidebarAdmin from "../components/SidebarAdmin/SidebarAdmin";
import WarehouseSearchAdmin from "../components/Warehouse/WarehouseSearchAdmin/WarehouseSearchAdmin";
import ProductsNavigateWarehouse from '../components/Warehouse/ProductsNavigateWarehouse/ProductsNavigateWarehouse'
import styles from '../styles/MenuAdminPage.module.css';

const WarehouseAdminPage = () => {
    return (
        <div className={styles.main}>
            <div>
                <SidebarAdmin />
            </div>
            <div className={styles.searchMenu}>
                <WarehouseSearchAdmin />
                <ProductsNavigateWarehouse />
            </div>
        </div>
    );
};

export default WarehouseAdminPage;