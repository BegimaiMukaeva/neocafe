import React, { useState } from "react";
import styles from "./DeleteItemModel.module.css";
import closeModal from "../../../img/X-black.svg";
import axios from "axios";

const DeleteItemModel = ({ isVisible, onClose, itemId, fetchProducts }) => {

    const handleDelete = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.delete(`https://muha-backender.org.kg/admin-panel/items/destroy/${itemId}/`, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            console.log("Элемент удален успешно:", itemId);
            fetchProducts();
            onClose();
        } catch (error) {
            console.error('Ошибка при удалении элемента:', error);
        }
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
                <p className={styles.categoryName}>Вы действительно хотите удалить данную позицию?</p>
                <div className={styles.deleteButtons}>
                    <button className={styles.deleteItemButton}  onClick={handleDelete}>Да</button>
                    <button className={styles.cancelDeleteButton}  onClick={onClose}>Нет</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteItemModel;

