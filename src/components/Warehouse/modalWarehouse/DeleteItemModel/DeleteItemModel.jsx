import React, { useState } from "react";
import styles from "./DeleteItemModel.module.css";
import closeModal from "../../../../img/X-black.svg";
import axios from "axios";

const DeleteItemModel = ({ isVisible, onClose, itemId, itemType, fetchItems, fetchProducts }) => {
    const handleDelete = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const url = itemType === 'ingredient'
                ? `https://muha-backender.org.kg/admin-panel/ingredients/destroy/${itemId}/`
                : `https://muha-backender.org.kg/admin-panel/ready-made-products/destroy/${itemId}/`;
            await axios.delete(url, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            console.log(`${itemType} удален успешно:`, itemId);
            onClose();
            if (fetchItems) {
                fetchItems();
            }
        } catch (error) {
            console.error(`Ошибка при удалении ${itemType}:`, error);
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

