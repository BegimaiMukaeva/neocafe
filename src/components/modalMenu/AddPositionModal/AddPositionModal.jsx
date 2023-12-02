import React, { useState, useEffect } from 'react';
import {useDispatch} from "react-redux";
import axios from 'axios';
import styles from './AddPositionModal.module.css';
import closeModal from "../../../img/X-black.svg";
import productImage from "../../../img/CloudArrowUp.png";
import plusSvg from '../../../img/Plus-white.svg';
import dropdownVector from '../../../img/dropdown-vector.svg';
import openDropdownVector from '../../../img/dropdownVectorOpen.svg';
import {addNewCompositionMenu} from "../../../store/compositionMenuSlice";

function AddPositionModal({ isVisible, onClose, options }) {
    const [positionName, setPositionName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState("");
    const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
    const [errorMessage, setErrorMessage] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const dispatch = useDispatch();

    const fetchAvailableIngredients = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get('https://muha-backender.org.kg/admin-panel/ingredients/', {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            setAvailableIngredients(response.data);
        } catch (error) {
            console.error('Ошибка при получении списка ингредиентов:', error);
        }
    };

    useEffect(() => {
        fetchAvailableIngredients();
    }, []);

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
        if (!showDropdown) {
            fetchCategories();
        }
    }, [showDropdown]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleCategorySelect = (categoryId, categoryName, event) => {
        event.stopPropagation();
        setSelectedCategoryId(categoryId);
        setSelectedCategory(categoryName);
        setTimeout(() => setShowDropdown(false), 0);
        console.log("Текущие ингредиенты:", ingredients);

    };
    const handleSelectIngredient = (selectedIngredientName, amount, index) => {
        const selectedIngredient = availableIngredients.find(ingredient => ingredient.name === selectedIngredientName);
        if (selectedIngredient) {
            const newIngredients = [...ingredients];
            newIngredients[index] = {
                ...newIngredients[index],
                id: selectedIngredient.id,
                name: selectedIngredientName,
                amount: amount
            };
            setIngredients(newIngredients);
        }
    };



    const addIngredient = () => {
        setIngredients([...ingredients, { id: "", name: "", amount: "" }]);
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };

        if (field === "name") {
            const selectedIngredient = availableIngredients.find(ing => ing.name === value);
            if (selectedIngredient) {
                newIngredients[index].id = selectedIngredient.id;
            }
        }

        setIngredients(newIngredients);
    };

    const isFormValid = () => {
        if (!positionName || !description || !price) {
            return false;
        }
        return true;
    };


    const createPosition = async () => {
        const data = {
            name: positionName,
            description: description,
            category: parseInt(selectedCategoryId),
            price: parseFloat(price),
            is_available: true,
            composition: ingredients.map(ingredient => ({
                ingredient: ingredient.id,
                quantity: parseFloat(ingredient.amount)
            }))
        };
        console.log('Отправляемые данные для создания позиции:', data);


        dispatch(addNewCompositionMenu(data));

    }

    const uploadImage = async (positionId) => {
        const formData = new FormData();
        formData.append('image', image);

        try {
            const accessToken = localStorage.getItem('accessToken');

            await axios.put(`https://muha-backender.org.kg/admin-panel/put-image-to-item/${positionId}/`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            console.log('Изображение успешно загружено');
        } catch (error) {
            console.error('Ошибка при загрузке изображения:', error.response ? error.response.data : error);

        }
    };

    const handleSubmit = async () => {
        resetFields();
        onClose();

        const positionId = await createPosition();
        if (positionId && image) {
            await uploadImage(positionId);
        }
    };

    const resetFields = () => {
        setPositionName("");
        setDescription("");
        setSelectedCategory("");
        setImage(null);
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
                        {/*<label className={styles.nameOfInput}>Категория*/}
                        {/*//     <div className={styles.dropdown}>*/}
                        {/*//         <button className={`${styles.dropdownButton} ${showDropdown ? styles.dropdownButtonOpen : ''}`} onClick={toggleDropdown}>*/}
                        {/*//               {selectedCategory || "Выберите категорию"}*/}
                        {/*//               <span className={styles.dropdownArrow}>*/}
                        {/*//                 <img*/}
                        {/*//                   src={showDropdown ? openDropdownVector : dropdownVector}*/}
                        {/*//                   alt=""*/}
                        {/*//                 />*/}
                        {/*//               </span>*/}
                        {/*//         </button>*/}
                        {/*//         {showDropdown && (*/}
                        {/*//           <div className={styles.dropdownMenu}>*/}
                        {/*//             {categories.map((category) => (*/}
                        {/*//                   <div*/}
                        {/*                      className={styles.dropdownItem}*/}
                        {/*                      key={category.id}*/}
                        {/*                      onClick={(event) => handleCategorySelect(category.id, category.name, event)}*/}
                        {/*                  >*/}
                        {/*                      {category.name}*/}
                        {/*                  </div>*/}
                        {/*              ))}*/}
                        {/*          </div>*/}
                        {/*        )}*/}
                        {/*    </div>*/}
                        {/*</label>*/}
                        <label className={styles.nameOfInput} htmlFor="">Категория
                            <select
                                value={selectedCategoryId}
                                onChange={e => {
                                    const selectedId = e.target.value;
                                    const selectedCat = categories.find(cat => cat.id.toString() === selectedId);
                                    setSelectedCategory(selectedCat ? selectedCat.name : '');
                                    setSelectedCategoryId(selectedId);
                                }}
                                className={styles.selectInput}
                            >
                                <option value="">Выберите категорию</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
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
                                    <label htmlFor="">Наименование
                                        <select
                                            value={ingredient.name}
                                            onChange={(e) => handleSelectIngredient(e.target.value, ingredient.amount, index)}
                                            className={styles.ingredientInput}
                                        >
                                            <option value="">Выберите ингредиент</option>
                                            {availableIngredients.map(ing => (
                                                <option key={ing.id} value={ing.name}>{ing.name}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="">Кол-во (в гр, мл, л, кг)
                                        <input
                                            type="number"
                                            placeholder="Количество"
                                            value={ingredient.amount}
                                            onChange={e => handleIngredientChange(index, 'amount', e.target.value)}
                                            className={styles.amountInput}
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>

                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    <button onClick={addIngredient} className={styles.addButton}>
                        Добавить еще
                        <img src={plusSvg} alt=""/>
                    </button>

                    <div className={styles.buttons}>
                        <button className={styles.cancelButton} onClick={() => {
                            resetFields();
                            onClose();
                        }}>Отмена</button>
                        <button className={styles.saveButton} disabled={!isFormValid()} onClick={handleSubmit}>Сохранить</button>
                    </div>
                </div>
            </div>
        )
    );
}

export default AddPositionModal;

