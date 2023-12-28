import React, { useState }  from 'react';
import { useDispatch } from 'react-redux';
import { searchTerm } from '../../../store/branchesAdminSlice'
import searchIcon from '../../../img/searchAdminIcon.svg';
import styles from '../../SearchMenuAdmin/SearchMenuAdmin.module.css';
import NotificationsAdminPage from '../../modalMenu/NotificationsAdminPage/NotificationsAdminPage';
import AddNewBranch from '../../branches/AddNewBranch/AddNewBranch';
import searchInputIcon from "../../../img/searchIcon.svg";
import {fetchBranchesBySearch} from "../../../store/branchesAdminSlice";

const BranchesSearchAdmin = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const dispatch = useDispatch();

    const handleSearchChange = async (event) => {
        const searchTerm = event.target.value;
        dispatch(fetchBranchesBySearch(searchTerm));
    };

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
                <h2>Филиалы</h2>
                <button className={styles.searchMenuButton} onClick={showModal}>
                    <img className={styles.searchIcon} src={searchIcon} alt=""/>
                </button>
                <NotificationsAdminPage
                    isVisible={isModalVisible}
                    onClose={handleCancel}
                />
            </div>
            <div className={styles.searchMenuInput}>
                <div className={styles.searchContainer}>
                    <span className={styles.searchIconInput}>
                        <img src={searchInputIcon} alt=""/>
                    </span>
                    <input
                        className={styles.searchInput}
                        type="search"
                        placeholder={'Поиск'}
                        onChange={handleSearchChange}
                    />
                </div>
                <button className={styles.newPosition} onClick={openModal}>Создать</button>
                <AddNewBranch
                    isVisible={isAddModalVisible}
                    onClose={cancelModal}
                />
            </div>
        </div>
    );
};

export default BranchesSearchAdmin;