import React from 'react';
import styles from "../../branches/DeleteBranchModel/DeleteBranchModel.module.css";
import closeModal from "../../../img/X-black.svg";
import axios from "axios";

const DeleteStaffModel = ({ isVisible, onClose, categoryName, employeeId }) => {
    const handleSubmit = async () => {
        try {
            const response = await axios.delete(`https://muha-backender.org.kg/admin-panel/employees/destroy/${employeeId}/`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
            });
            if (response.status === 200) {
                console.log("Сотрудник удален:", employeeId);
                onClose();
            }
        } catch (error) {
            console.error('Ошибка при удалении сотрудника:', error);
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
                <p className={styles.categoryName}>Вы действительно хотите удалить данного сотрудника?</p>
                <div className={styles.deleteButtons}>
                    <button className={styles.deleteItemButton}  onClick={handleSubmit}>Да</button>
                    <button className={styles.cancelDeleteButton}  onClick={onClose}>Нет</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteStaffModel;
