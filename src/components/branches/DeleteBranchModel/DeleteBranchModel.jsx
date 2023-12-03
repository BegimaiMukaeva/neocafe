import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteBranch } from '../../../store/branchesAdminSlice';
import styles from "./DeleteBranchModel.module.css";
import closeModal from "../../../img/X-black.svg";

const DeleteBranchModel = ({ isVisible, onClose, branchId }) => {
    const dispatch = useDispatch();

    const handleSubmit = () => {
        dispatch(deleteBranch(branchId))
            .then(() => {
                onClose();
            })
            .catch(error => {
                console.error('Ошибка при удалении филиала:', error);
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
                <p className={styles.categoryName}>Вы действительно хотите удалить данный филиал?</p>
                <div className={styles.deleteButtons}>
                    <button className={styles.deleteItemButton} onClick={handleSubmit}>Да</button>
                    <button className={styles.cancelDeleteButton} onClick={onClose}>Нет</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteBranchModel;
