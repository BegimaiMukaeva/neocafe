import React from 'react';
import styles from "./DeleteBranchModel.module.css";
import closeModal from "../../../img/X-black.svg";

const DeleteBranchModel = ({ isVisible, onClose, categoryName }) => {
    const handleSubmit = () => {
        console.log("Новая категория:", categoryName);
    };
    return (
        <div className={isVisible ? styles.modalDeleteWrapper : styles.modalHidden}>
          <div className={styles.deleteModalContent}>
            <div className={styles.titleDeleteModal}>
              <h3>Удаление</h3>
              <button className={styles.modalCloseButton} onClick={onClose}>
                <img src={closeModal} alt=""/>
              </button>
            </div>
            <p className={styles.categoryName}>Вы действительно хотите удалить данный филиал?</p>
            <div className={styles.deleteButtons}>
                <button className={styles.deleteItemButton}  onClick={handleSubmit}>Да</button>
                <button className={styles.cancelDeleteButton}  onClick={onClose}>Нет</button>
            </div>
          </div>
        </div>
    );
};

export default DeleteBranchModel;
