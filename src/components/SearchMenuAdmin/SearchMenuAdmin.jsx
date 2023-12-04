import React, { useState }  from 'react';
import { useDispatch } from 'react-redux';
import { fetchProductsBySearch } from '../../store/compositionMenuSlice';
import searchIcon from '../../img/searchAdminIcon.svg';
import searchInputIcon from '../../img/searchIcon.svg';
import styles from './SearchMenuAdmin.module.css';
import NotificationsAdminPage from '../modalMenu/NotificationsAdminPage/NotificationsAdminPage';
import AddPositionModal from '../modalMenu/AddPositionModal/AddPositionModal';

const SearchMenuAdmin = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
   const dispatch = useDispatch();

  const handleSearchChange = async (event) => {
    const searchTerm = event.target.value;
    dispatch(fetchProductsBySearch(searchTerm));
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
                <div className={styles.searchContainer}>
                    <span className={styles.searchIconInput}>
                        <img src={searchInputIcon} alt=""/>
                    </span>
                    <input
                        className={styles.searchInput}
                        type="search"
                        placeholder={'Поиск'}
                        // value={searchTerm}
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

export default SearchMenuAdmin;