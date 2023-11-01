import React, {useRef, useEffect, useState} from "react";
import styles from "./EditDeleteItemModel.module.css";
import pencilImg from "../../../img/Pencil.svg";
import trashSimple from '../../../img/TrashSimpleEditDelete.svg';
import DeleteItemModel from "../DeleteItemModel/DeleteItemModel";

const EditDeleteItemModel = ({ isVisible, onClose, categoryName }) => {
    const modalContentRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const handleSubmit = () => {
        console.log("Новая категория:", categoryName);
    };

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

    return (
        <div className={isVisible ? styles.modalWrapper : styles.modalHidden}>
            <div className={styles.modalContent} ref={modalContentRef}>
                <div className={styles.buttons}>
                    <button className={styles.redactorButton} onClick={handleSubmit}>
                        <img src={pencilImg} alt=""/>
                        Редактировать
                    </button>
                    <button className={styles.redactorButton} onClick={toggleModal}>
                        <img src={trashSimple} alt=""/>
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
