import React from 'react';
import { useDispatch } from 'react-redux';
import styles from "../../branches/DeleteBranchModel/DeleteBranchModel.module.css";
import closeModal from "../../../img/X-black.svg";
import {deleteStaffAdmin} from "../../../store/staffAdminSlice";

const DeleteStaffModel = ({ isVisible, onClose, employeeId }) => {
    const dispatch = useDispatch();
    const handleSubmit = () => {
        dispatch(deleteStaffAdmin(employeeId))
            .then(() => {
                onClose();
            });
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
