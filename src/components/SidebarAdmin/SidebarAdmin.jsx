import React, {useState} from 'react';
import iconSidebar from '../../img/icon.svg';
import signOut from '../../img/SignOut.svg';
import { Link } from "react-router-dom";
import styles from './SidebarAdmin.module.css';
import SignOut from '../SignOut/SignOut';

const SidebarAdmin = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={styles.main}>
            <div className={styles.sidebarMenuImg}>
                <img src={iconSidebar} alt=""/>
            </div>
            <div className={styles.sidebarMenu}>
                <Link to='/'>Меню</Link>
            </div>
            <div className={styles.sidebarMenu}>
                <Link to='/warehouse-admin-page'>Склад</Link>
            </div>
            <div className={styles.sidebarMenu}>
                <Link to='/branches-admin-page'>Филиалы</Link>
            </div>
            <div className={styles.sidebarMenu}>
                <Link to='/employees-page-admin'>Сотрудники</Link>
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