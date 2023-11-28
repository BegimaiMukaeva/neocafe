import React, { useState }  from 'react';
import searchIcon from '../../../img/searchAdminIcon.svg';
import styles from './EmployeesSearchAdmin.module.css';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import NotificationsAdminPage from '../../modalMenu/NotificationsAdminPage/NotificationsAdminPage';
import AddNewStaffModel from '../AddNewStaffModel/AddNewStaffModel';

const EmployeesSearchAdmin = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const openModal = () => {
        setIsAddModalVisible(true);
    };

    const cancelModal = () => {
        setIsAddModalVisible(false);
    };

    return (
        <div className={styles.main}>
            <div className={styles.searchMenu}>
                <h2>Сотрудники</h2>
                <button className={styles.searchMenuButton} onClick={showModal}>
                    <img className={styles.searchIcon} src={searchIcon} alt=""/>
                </button>
                <NotificationsAdminPage
                    isVisible={isModalVisible}
                    onClose={handleCancel}
                />
            </div>
            <div className={styles.searchMenuInput}>
                <Input className={styles.searchInput} prefix={<SearchOutlined/>} placeholder='Поиск' />
                <button className={styles.newPosition} onClick={openModal}>Создать</button>
                <AddNewStaffModel
                    isVisible={isAddModalVisible}
                    onClose={cancelModal}
                />
                <label className={styles.filterStaffTitle}>
                    <input
                        type="checkbox"
                        className={styles.checkboxDay}
                    />
                    Фильтр по рейтингу
                </label>
            </div>
        </div>
    );
};

export default EmployeesSearchAdmin;