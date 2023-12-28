import React, { useState }  from 'react';
import { useDispatch } from 'react-redux';
import {searchTerm} from '../../../store/warehouseAdminSlice';
import searchIcon from '../../../img/searchAdminIcon.svg';
import styles from '../../SearchMenuAdmin/SearchMenuAdmin.module.css';
import NotificationsAdminPage from '../../modalMenu/NotificationsAdminPage/NotificationsAdminPage';
import AddPositionModal from '../modalWarehouse/AddPositionModal/AddPositionModal';
import searchInputIcon from "../../../img/searchIcon.svg";
import { fetchIngredientsBySearch } from "../../../store/warehouseAdminSlice";
import { fetchIngredients } from "../../../store/warehouseAdminSlice";
import {fetchProducts} from "../../../store/warehouseAdminSlice";
import {fetchProductsBySearch} from "../../../store/warehouseAdminSlice";


const WarehouseSearchAdmin = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const dispatch = useDispatch();

    const handleSearchChange = async (event) => {
        const searchTerm = event.target.value;
        if (searchTerm) {
            dispatch(fetchIngredientsBySearch(searchTerm));
            dispatch(fetchProductsBySearch(searchTerm));
        } else {
            dispatch(fetchIngredients());
            dispatch(fetchProducts());
        }
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
                <h2>Склад</h2>
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
                <AddPositionModal
                    isVisible={isAddModalVisible}
                    onClose={cancelModal}
                />
            </div>
        </div>
    );
};

export default WarehouseSearchAdmin;