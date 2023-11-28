import React from "react";
import axios from 'axios';
import styles from "./DeleteCategoryModal.module.css";
import closeModal from "../../../img/X-black.svg";

const DeleteCategoryModal = ({ isVisible, onClose, categoryName, categoryId }) => {
    const handleSubmit = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');

            await axios.delete(`https://muha-backender.org.kg/admin-panel/categories/destroy/${categoryId}/`, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            console.log("Категория удалена:", categoryName);
            onClose();
        } catch (error) {
            console.error('Ошибка при удалении категории: ', error);
        }
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
                <p className={styles.categoryName}>Вы действительно хотите удалить категорию «‎{categoryName}»?</p>
                <div className={styles.buttons}>
                    <button className={styles.cancelButton} onClick={handleSubmit}>Да</button>
                    <button className={styles.categoryAddButton} onClick={onClose}>Нет</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCategoryModal;
