import React, {useRef, useEffect, useState} from "react";
import styles from "../../modalMenu/EditDeleteItemModel/EditDeleteItemModel.module.css";
import pencilImg from "../../../img/Pencil.svg";
import trashSimple from '../../../img/TrashSimpleEditDelete.svg';
import DeleteItemModel from "../DeleteBranchModel/DeleteBranchModel";
import EditPositionMenu from '../EditBranchModal/EditBranchModal';

const EditDeleteItemModel = ({ isVisible, onClose, categoryName }) => {
    const modalContentRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (isVisible && modalContentRef.current && !modalContentRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleDocumentClick);

        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, [isVisible, onClose]);

    const toggleModal = () => {
        setIsModalOpen(true);
    };
   const handleCancel = () => {
       setIsModalOpen(false);
   };
   const openEditModal = () => {
        setIsEditModalOpen(true);
    };
   const closeEditModal = () => {
       setIsEditModalOpen(false);
   };


    return (
        <div className={isVisible ? styles.modalWrapper : styles.modalHidden}>
            <div className={styles.modalContent} ref={modalContentRef}>
                <div className={styles.buttons}>
                    <button className={styles.redactorButton} onClick={openEditModal}>
                        <img className={styles.buttonImg} src={pencilImg} alt=""/>
                        Редактировать
                    </button>
                    <EditPositionMenu
                      isVisible={isEditModalOpen}
                      onClose={closeEditModal}
                    />
                    <button className={styles.redactorButton} onClick={toggleModal}>
                        <img className={styles.buttonImg} src={trashSimple} alt=""/>
                        Удалить
                    </button>
                    <DeleteItemModel
                      isVisible={isModalOpen}
                      onClose={handleCancel}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditDeleteItemModel;
