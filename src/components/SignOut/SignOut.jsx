import React, { useState } from "react";
import styles from "./SignOut.module.css";
import closeModal from "../../img/X-black.svg";

const SignOut = ({ isVisible, onClose }) => {

    return (
       <div className={isVisible ? styles.modalDeleteWrapper : styles.modalHidden}>
          <div className={styles.deleteModalContent}>
            <div className={styles.titleDeleteModal}>
              <h3>Удаление</h3>
              <button className={styles.modalCloseButton} onClick={onClose}>
                <img src={closeModal} alt=""/>
              </button>
            </div>
            <p className={styles.categoryName}>Вы действительно хотите выйти?</p>
            <div className={styles.deleteButtons}>
                <button className={styles.deleteItemButton}>Да</button>
                <button className={styles.cancelDeleteButton}  onClick={onClose}>Нет</button>
            </div>
          </div>
        </div>
    );
};

export default SignOut;

