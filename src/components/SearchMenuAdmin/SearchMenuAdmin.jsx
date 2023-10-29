import React, { useState }  from 'react';
import searchIcon from '../../img/searchAdminIcon.svg';
import styles from './SearchMenuAdmin.module.css';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import NotificationsAdminPage from '../../components/modalMenu/NotificationsAdminPage/NotificationsAdminPage'

const SearchMenuAdmin = () => {
const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <div className={styles.main}>
            <div className={styles.searchMenu}>
                <h2>Меню</h2>
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
                <button>Создать</button>
            </div>
        </div>
    );
};

export default SearchMenuAdmin;