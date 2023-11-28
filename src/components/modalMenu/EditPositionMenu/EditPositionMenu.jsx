import React, { useState, useEffect } from 'react';
import styles from './EditPositionMenu.module.css';
import closeModal from "../../../img/X-black.svg";
import productImage from "../../../img/CloudArrowUp.png";
import plusSvg from '../../../img/Plus-white.svg';
import axios from "axios";

function EditPositionMenu({ isVisible , onClose, fetchProducts , itemId }) {
    const [positionName, setPositionName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [price, setPrice] = useState("");
    const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
    const [categories, setCategories] = useState([]);
    const [imageChanged, setImageChanged] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [availableIngredients, setAvailableIngredients] = useState([]);


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


//              const handleSelectIngredient = (selectedIngredientId, amount, index) => {
//   const selectedIngredient = availableIngredients.find(ingredient => ingredient.id === selectedIngredientId);
//   if (selectedIngredient) {
//     const newIngredients = [...ingredients];
//     newIngredients[index] = {
//       id: selectedIngredient.id,
//       name: selectedIngredient.name,
//       amount: amount
//     };
//     setIngredients(newIngredients);
//   }
// };
//
//
// const handleIngredientChange = (index, field, value) => {
//   const newIngredients = [...ingredients];
//   newIngredients[index] = { ...newIngredients[index], [field]: value };
//   setIngredients(newIngredients);
// };

    const handleSelectIngredient = (selectedIngredientId, index) => {
        setIngredients(currentIngredients => {
            const newIngredients = currentIngredients.map((ingredient, idx) => {
                if (idx === index) {
                    const selectedIngredient = availableIngredients.find(ingredient => ingredient.id === selectedIngredientId);
                    return {
                        ...ingredient,
                        id: selectedIngredient.id,
                        name: selectedIngredient.name
                    };
                }
                return ingredient;
            });
            console.log('Updated Ingredients After Selection:', newIngredients);
            return newIngredients;
        });
    };
    const handleIngredientChange = (index, value) => {
        setIngredients(currentIngredients => {
            const newIngredients = currentIngredients.map((ingredient, idx) => {
                if (idx === index) {
                    return { ...ingredient, amount: value };
                }
                return ingredient;
            });
            console.log('Updated Ingredients After Amount Change:', newIngredients);
            return newIngredients;
        });
    };

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



    useEffect(() => {
        if (itemId) {
            const fetchItemData = async () => {
                try {
                    const response = await axios.get(`https://muha-backender.org.kg/admin-panel/items/${itemId}`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                    });
                    setPositionName(response.data.name);
                    setDescription(response.data.description);
                    setPrice(response.data.price);
                    setImage(response.data.image);
                    setSelectedCategoryId(response.data.category.id);

                    const updatedIngredients = response.data.compositions.map(comp => {
                        const foundIngredient = availableIngredients.find(ing => ing.id === comp.ingredient);
                        return {
                            id: comp.ingredient,
                            name: foundIngredient ? foundIngredient.name : 'Неизвестный ингредиент',
                            amount: comp.quantity
                        };
                    });

                    setIngredients(updatedIngredients);

                } catch (error) {
                    console.error('Ошибка при получении данных о позиции:', error);
                }
            };

            fetchItemData();
        }
    }, [itemId]);

    const handleCategoryChange = (e) => {
        setSelectedCategoryId(e.target.value);
    };



    const saveChanges = async () => {
        if (isFormValid()) {
            try {
                const updatedData = {
                    name: positionName,
                    description: description,
                    category_id: parseInt(selectedCategoryId),
                    price: parseFloat(price),
                    is_available: true,
                    compositions: ingredients.map(ingredient => ({
                        ingredient: ingredient.id,
                        quantity: parseFloat(ingredient.amount)
                    }))
                };
                console.log(updatedData)
                const response = await axios.patch(`https://muha-backender.org.kg/admin-panel/items/update/${itemId}/`, updatedData, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });

                if (imageChanged) {
                    const formData = new FormData();
                    formData.append('image', image);

                    await axios.patch(`https://muha-backender.org.kg/admin-panel/put-image-to-item/${itemId}/`, formData, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                    });
                }
                fetchProducts();
                console.log('Изменения успешно сохранены');
                onClose();
            } catch (error) {
                console.error('Ошибка при сохранении изменений:', error);
                setErrorMessage("Ошибка при сохранении изменений.");
            }
        } else {
            setErrorMessage("Заполните все обязательные поля.");
        }
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
        for (let ingredient of ingredients) {
            if (!ingredient.name || !ingredient.amount) {
                return false;
            }
        }
        return true;
    };
    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setImageChanged(true);
        }
    };

    return (
        isVisible && (
            <div className={styles.modalOverlay}>
                <div className={styles.modalContainer}>
                    <div className={styles.titleModal}>
                        <h2 className={styles.title}>Новая позиция</h2>
                        <button className={styles.modalCloseButton} onClick={onClose}>
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
                                    image instanceof File || image instanceof Blob ?
                                        <img src={URL.createObjectURL(image)} alt="Предварительный просмотр" /> :
                                        <img src={image} alt="Предварительный просмотр" />
                                )}
                            </div>
                        </div>
                        <input
                            type="file"
                            id="imageUpload"
                            accept=".jpg, .jpeg, .png"
                            onChange={handleImageChange}
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
                        <label className={styles.nameOfInput} htmlFor="">Категория
                            <select
                                value={selectedCategoryId}
                                onChange={handleCategoryChange}
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
                                            value={ingredient.id}
                                            onChange={e => handleSelectIngredient(parseInt(e.target.value), index)}
                                            className={styles.ingredientInput}
                                        >
                                            <option value="">Выберите ингредиент</option>
                                            {availableIngredients.map(ing => (
                                                <option key={ing.id} value={ing.id}>{ing.name}</option>
                                            ))}
                                        </select>
                                    </label>
                                </div>

                                <div className={styles.compositionOfDish}>
                                    <label htmlFor="">Кол-во (в гр, мл, л, кг)
                                        <input
                                            type="number"
                                            placeholder="Количество"
                                            value={ingredient.amount}
                                            onChange={e => handleIngredientChange(index, 'amount', e.target.value)}
                                            className={styles.amountInput}
                                        />
                                    </label>

                                    {/*<label className={styles.nameOfInput}  htmlFor="">Изм-я*/}
                                    {/*    <select*/}
                                    {/*        className={styles.selectInput}*/}
                                    {/*    >*/}
                                    {/*      <option>грамм</option>*/}
                                    {/*      <option>кг</option>*/}
                                    {/*      <option>мл</option>*/}
                                    {/*      <option>литр</option>*/}
                                    {/*      <option>шт</option>*/}
                                    {/*  </select>*/}
                                    {/*</label>*/}

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
                        <button className={styles.cancelButton} onClick={onClose}>Отмена</button>
                        <button className={styles.saveButton} onClick={saveChanges} disabled={!isFormValid()}>Обновить</button>
                    </div>
                </div>
            </div>
        )
    );
}

export default EditPositionMenu;
