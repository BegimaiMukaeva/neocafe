import React, { useState } from "react";
import styles from "./DeleteCategoryModal.module.css";
import closeModal from "../../../img/X-black.svg";

const DeleteCategoryModal = ({ isVisible, onClose, categoryName }) => {
    // const [categoryName, setCategoryName] = useState('');

    const handleSubmit = () => {
        console.log("Новая категория:", categoryName);
    };

    return (
        <div className={isVisible ? styles.modalWrapper : styles.modalHidden}>
          <div className={styles.modalContent}>
            <div className={styles.cancelButtonCategory}>
              <h2>Удаление</h2>
              <button className={styles.modalCloseButton} onClick={onClose}>
                <img src={closeModal} alt=""/>
              </button>
            </div>
            <p className={styles.categoryName}>  Вы действительно хотите удалить категорию «‎{categoryName}»?</p>
            <div className={styles.buttons}>
                <button className={styles.cancelButton}  onClick={handleSubmit}>Да</button>
                <button className={styles.categoryAddButton} onClick={onClose}>Нет</button>
            </div>
          </div>
        </div>
    );
};

export default DeleteCategoryModal;

