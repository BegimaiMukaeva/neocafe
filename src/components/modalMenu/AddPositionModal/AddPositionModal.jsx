import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AddPositionModal.module.css';
import closeModal from "../../../img/X-black.svg";
import productImage from "../../../img/CloudArrowUp.png";
import plusSvg from '../../../img/Plus-white.svg';
import dropdownVector from '../../../img/dropdown-vector.svg';
import openDropdownVector from '../../../img/dropdownVectorOpen.svg';

function AddPositionModal({ isVisible , onClose, options }) {
    const [positionName, setPositionName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [ingredientType, setIngredientType] = useState(""); // Сырье или Готовая продукция
    const [measurement, setMeasurement] = useState("");
    const [amount, setAmount] = useState("");
    const [price, setPrice] = useState("");
    const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
    const [errorMessage, setErrorMessage] = useState("");
    const [categories, setCategories] = useState([]); // Состояние для хранения категорий
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const fetchCategories = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await axios.get('https://muha-backender.org.kg/admin-panel/categories/', {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Ошибка при получении категорий: ', error);
    }
  };

   useEffect(() => {
    }, [showDropdown]);

   const toggleDropdown = () => {
        if (!showDropdown) {
            fetchCategories();
        }
        setShowDropdown(!showDropdown);
    };
    const handleCategorySelect = (categoryId, categoryName, event) => {
        event.stopPropagation();
        setSelectedCategoryId(categoryId); // Сохранение ID категории
        setSelectedCategory(categoryName); // Сохранение имени для отображения
        setTimeout(() => setShowDropdown(false), 0);
    };


   const addIngredient = () => {
        const lastIngredient = ingredients[ingredients.length - 1];

        if (!lastIngredient.name || !lastIngredient.amount) {
            setErrorMessage("Сначала заполните предыдущие поля для состав блюда!");
            return;
        }

        setIngredients([...ingredients, { name: "", amount: "" }]);
        setErrorMessage("");
    };

   const isFormValid = () => {
        if (!positionName || !description || !price) {
            return false;
        }
        // for (let ingredient of ingredients) {
        //     if (!ingredient.name || !ingredient.amount) {
        //         return false;
        //     }
        // }
        return true;
   };

const handleSubmit = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('name', positionName);
    formData.append('category', parseInt(selectedCategoryId)); // Преобразование ID категории в число
    formData.append('price', parseFloat(price)); // Убедитесь, что цена имеет правильный формат
    formData.append('is_available', true);

    if (image) {
      formData.append('image', image);
    }

     console.log('Ingredients:', ingredients); // Логирование ингредиентов

    ingredients.forEach((ingredient, index) => {
      if (ingredient.amount && !isNaN(ingredient.amount)) {
        formData.append(`composition[${index}][ingredient]`, parseInt(ingredient.id));
        formData.append(`composition[${index}][quantity]`, parseFloat(ingredient.amount));
      }
    });

    // Логирование содержимого formData перед отправкой
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }


    const response = await axios.post('https://muha-backender.org.kg/admin-panel/items/create/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}`
      }
    });

    console.log('Позиция создана успешно:', response.data);
  } catch (error) {
      console.log(error.response.data)
    console.error('Ошибка при создании позиции:', error.response.data); // Изменено для более точного отображения ошибки
  }
};



   const resetFields = () => {
        setPositionName("");
        setDescription("");
        setSelectedCategory("");
        setImage(null);
        setIngredientType("");
        setMeasurement("");
        setAmount("");
        setPrice("");
        setIngredients([{ name: "", amount: "" }]);
        setErrorMessage("");
    };

    return (
        isVisible && (
          <div className={styles.modalOverlay}>
              <div className={styles.modalContainer}>
                  <div className={styles.titleModal}>
                      <h2 className={styles.title}>Новая позиция</h2>
                      <button className={styles.modalCloseButton} onClick={() => {
                            resetFields();
                            onClose();
                        }}>
                            <img src={closeModal} alt=""/>
                        </button>
                  </div>

                  <div className={styles.imageUpload}>
                    <label htmlFor="imageUpload" className={styles.imageLabel}>
                        Добавьте фотографию к позиции
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


                  <p className={styles.imageLabel}>Наименование, категория и стоимость</p>
                  <label className={styles.nameOfInput}>Наименование
                      <input
                          type="text"
                          placeholder="Название позиции"
                          value={positionName}
                          onChange={e => setPositionName(e.target.value)}
                          className={styles.textInput}
                      />
                  </label>
                  <label className={styles.nameOfInput}>Описание
                      <textarea
                          placeholder="Описание"
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          className={styles.textArea}
                      />
                  </label>


                  <div className={styles.categoryAndPrice}>
                      <label className={styles.nameOfInput}>Категория
                          <div className={styles.dropdown}>
                              <button className={`${styles.dropdownButton} ${showDropdown ? styles.dropdownButtonOpen : ''}`} onClick={toggleDropdown}>
                                    {selectedCategory || "Выберите категорию"}
                                    <span className={styles.dropdownArrow}>
                                      <img
                                        src={showDropdown ? openDropdownVector : dropdownVector}
                                        alt=""
                                      />
                                    </span>
                              </button>
                              {showDropdown && (
                                <div className={styles.dropdownMenu}>
                                  {categories.map((category) => (
                                        <div
                                            className={styles.dropdownItem}
                                            key={category.id}
                                            onClick={(event) => handleCategorySelect(category.id, category.name, event)}
                                        >
                                            {category.name}
                                        </div>
                                    ))}
                                </div>
                              )}
                          </div>
                      </label>

                      <label className={styles.nameOfInput} htmlFor="">Стоимость
                           <input
                              type="number"
                              placeholder="Введите стоимость"
                              value={price}
                              onChange={e => setPrice(e.target.value)}
                              className={styles.numberInput}
                          />
                      </label>

                  </div>


                  <p className={styles.imageLabel}>Состав блюда и граммовка</p>
                  <div className={styles.ingredientsList}>
                      {ingredients.map((ingredient, index) => (
                          <div key={index} className={styles.categoryAndPrice}>
                              <div>
                                  <label className={styles.nameOfInput}  htmlFor="">Наименование
                                      <input
                                          type="text"
                                          placeholder="Название ингредиента"
                                          value={ingredient.name}
                                          onChange={e => {
                                              const newIngredients = [...ingredients];
                                              newIngredients[index].name = e.target.value;
                                              setIngredients(newIngredients);
                                          }}
                                          className={styles.ingredientInput}
                                      />
                                  </label>
                              </div>

                              <div className={styles.compositionOfDish}>
                                  <label className={styles.nameOfInput}  htmlFor="">Кол-во (в гр, мл, л, кг)
                                      <input
                                          type="number"
                                          placeholder="Количество"
                                          value={ingredient.amount}
                                          onChange={e => {
                                              const newIngredients = [...ingredients];
                                              newIngredients[index].amount = e.target.value;
                                              setIngredients(newIngredients);
                                          }}
                                          className={styles.amountInput}
                                      />
                                  </label>
                                  <label className={styles.nameOfInput}  htmlFor="">Изм-я
                                      <select
                                          className={styles.selectInput}
                                      >
                                        <option>грамм</option>
                                        <option>кг</option>
                                        <option>мл</option>
                                        <option>литр</option>
                                        <option>шт</option>
                                    </select>
                                  </label>

                              </div>

                          </div>
                      ))}
                      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                      <button onClick={addIngredient} className={styles.addButton}>
                          Добавить еще
                          <img src={plusSvg} alt=""/>
                      </button>
                  </div>


                  <div className={styles.buttons}>
                      <button className={styles.cancelButton} onClick={() => {
                            resetFields();
                            onClose();
                        }}>Отмена</button>
                      <button className={styles.saveButton} disabled={!isFormValid()} onClick={handleSubmit}>Создать</button>
                  </div>
              </div>
          </div>
        )
    );
}

export default AddPositionModal;
