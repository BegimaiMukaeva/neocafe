import React, { useState } from "react";
import styles from "./AddNewCategory.module.css";
import closeModal from "../../../img/X-black.svg";

const AddNewCategory = ({ isVisible, onClose }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = () => {
    console.log("Новая категория:", categoryName);
  };

  return (
    <div className={isVisible ? styles.modalWrapper : styles.modalHidden}>
      <div className={styles.modalContent}>
        <div className={styles.cancelButtonCategory}>
          <h2>Новая категория</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <img src={closeModal} alt=""/>
          </button>
        </div>
        <p className={styles.categoryName}>Наименование</p>
        <input
          className={styles.categoryInput}
          type="text" 
          placeholder="Введите название категории"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <div className={styles.buttons}>
          <button className={styles.cancelButton} onClick={onClose}>Отмена</button>
          <button className={styles.categoryAddButton} onClick={handleSubmit}>Добавить</button>
        </div>
      </div>
    </div>
  );
};

export default AddNewCategory;
