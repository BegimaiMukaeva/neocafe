import React, { useState } from "react";
import styles from "./AddNewCategory.module.css";
import closeModal from "../../../img/X-black.svg";
import productImage from "../../../img/CloudArrowUp.png";

const AddNewCategory = ({ isVisible, onClose }) => {
  const [categoryName, setCategoryName] = useState('');
  const [image, setImage] = useState(null);

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
        <div className={styles.imageUpload}>
          <label htmlFor="imageUpload" className={styles.imageLabel}>
            Добавьте фотографию
          </label>
          <div className={styles.imageBorder}>
            <div className={styles.imagePreview}>
              {!image ? (
                  <img src={productImage} alt="Иконка загрузки" />
                  ) : (
                      <img src={URL.createObjectURL(image)} alt="Предварительный просмотр" />
                      )}
                      <p className={styles.imageText}>Перетащите изображение для изменения <br/> или <span className={styles.imageChangeText}>обзор</span></p>
            </div>
          </div>
          <input
              type="file"
              id="imageUpload"
              accept=".jpg, .jpeg, .png"
              onChange={(e) => setImage(e.target.files[0])}
              className={styles.imageInput}
          />
        </div>
        <div className={styles.buttons}>
          <button className={styles.cancelButton} onClick={onClose}>Отмена</button>
          <button className={styles.categoryAddButton} onClick={handleSubmit}>Добавить</button>
        </div>
      </div>
    </div>
  );
};

export default AddNewCategory;
