import React, {useState} from 'react';
import iconSidebar from '../../img/icon.svg';
import signOut from '../../img/SignOut.svg';
import { Link } from "react-router-dom";
import styles from './SidebarAdmin.module.css';
import SignOut from '../SignOut/SignOut';
import { useLocation } from "react-router-dom";

const SidebarAdmin = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const location = useLocation();

    const openModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className={styles.main}>
            <div className={styles.sidebarMenuImg}>
                <img src={iconSidebar} alt=""/>
            </div>
            <div className={styles.sidebarMenu}>
                <Link to='/' className={`${styles.sidebar} ${isActive('/') ? styles.active : ''}`}>Меню</Link>
            </div>
            <div className={styles.sidebarMenu}>
                <Link to='/warehouse-admin-page' className={`${styles.sidebar} ${isActive('/warehouse-admin-page') ? styles.active : ''}`}>Склад</Link>
            </div>
            <div className={styles.sidebarMenu}>
                <Link to='/branches-admin-page' className={`${styles.sidebar} ${isActive('/branches-admin-page') ? styles.active : ''}`}>Филиалы</Link>
            </div>
            <div className={styles.sidebarMenu}>
                <Link to='/employees-page-admin' className={`${styles.sidebar} ${isActive('/employees-page-admin') ? styles.active : ''}`}>Сотрудники</Link>
            </div>
            <div onClick={openModal} className={styles.sidebarMenuButton}>
                <button>Выход</button>
                <img src={signOut} alt=""/>
            </div>
            <SignOut
                isVisible={isModalOpen}
                onClose={handleCancel}
            />
        </div>
    );
};

export default SidebarAdmin;