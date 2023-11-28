import React, { useState, useEffect } from 'react';
import styles from './EditPositionModal.module.css';
import closeModalImg from "../../../../img/X-black.svg";
import axios from "axios";

function EditPositionModal({ isVisible, onClose, itemId, itemType, fetchIngredients, fetchProducts}) {
    const [positionName, setPositionName] = useState("");
    const [positionLimit, setPositionLimit] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const isFormValid = () => {
        return positionName && positionLimit;
    };


// useEffect(() => {
//   if (itemId) {
//     const accessToken = localStorage.getItem('accessToken');
//     axios.get(`https://muha-backender.org.kg/admin-panel/ingredients/${itemId}`, {
//       headers: {
//         'Authorization': `Bearer ${accessToken}`
//       }
//     })
//     .then(response => {
//       setPositionName(response.data.name);
//         console.log(response.data.name);
//       setPositionLimit(response.data.minimal_limit);
//     })
//     .catch(error => {
//       console.error('Ошибка при получении данных ингредиента:', error);
//       // Обработайте ошибку
//     });
//   }
// }, [itemId]);
    console.log(`Тип элемента: ${itemType}`);

    useEffect(() => {
        if (itemId) {
            const url = itemType === 'ingredient'
                ? `https://muha-backender.org.kg/admin-panel/ingredients/${itemId}`
                : `https://muha-backender.org.kg/admin-panel/ready-made-products/${itemId}`;

            console.log(`Запрашиваемый URL: ${url}`);

            axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
                .then(response => {
                    if (itemType === 'ingredient') {
                        setPositionName(response.data.name);
                        setPositionLimit(response.data.minimal_limit);
                    }
                    console.log(`Ответ сервера для ${itemType}:`, response.data);
                    const product = response.data.find(p => p.id === itemId);
                    if (product) {
                        setPositionName(product.name);
                        setPositionLimit(product.minimal_limit);
                    }

                })
                .catch(error => {
                    console.error(`Ошибка при получении данных для ${itemType}:`, error);
                });
        }
    }, [itemId, itemType]);



// const handleSubmit = () => {
//   if (isFormValid()) {
//     const updatedData = {
//       name: positionName,
//       minimal_limit: positionLimit,
//     };
//
//     const accessToken = localStorage.getItem('accessToken');
//     const headers = {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${accessToken}`
//     };
//
//     axios.patch(`https://muha-backender.org.kg/admin-panel/ingredients/update/${itemId}/`, updatedData, { headers })
//       .then(response => {
//         console.log('Данные успешно обновлены:', response.data);
//         onClose();
//         resetFields();
//         fetchIngredients();
//       })
//       .catch(error => {
//         console.error('Ошибка при обновлении данных:', error);
//         setErrorMessage("Ошибка при обновлении данных.");
//       });
//   } else {
//     setErrorMessage("Пожалуйста, заполните все поля.");
//   }
// };
    const handleSubmit = () => {
        if (isFormValid()) {
            const updatedData = {
                name: positionName,
                minimal_limit: positionLimit,
            };

            const accessToken = localStorage.getItem('accessToken');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            };

            const url = itemType === 'ingredient'
                ? `https://muha-backender.org.kg/admin-panel/ingredients/update/${itemId}/`
                : `https://muha-backender.org.kg/admin-panel/ready-made-products/update/${itemId}/`;

            axios.patch(url, updatedData, { headers })
                .then(response => {
                    console.log('Данные успешно обновлены:', response.data);
                    onClose();
                    resetFields();
                    itemType === 'ingredient' ? fetchIngredients() : fetchProducts();
                })
                .catch(error => {
                    console.error('Ошибка при обновлении данных:', error);
                    setErrorMessage("Ошибка при обновлении данных.");
                });
        } else {
            setErrorMessage("Пожалуйста, заполните все поля.");
        }
    };

    const resetFields = () => {
        setErrorMessage("");
    };

    return (
        isVisible && (
            <div className={styles.modalOverlay}>
                <div className={styles.modalContainer}>
                    <div className={styles.titleModal}>
                        <h2 className={styles.title}>Новая продукция</h2>
                        <button className={styles.modalCloseButton} onClick={() => {
                            onClose();
                        }}>
                            <img src={closeModalImg} alt="Закрыть"/>
                        </button>
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

                    <div className={styles.compositionOfDish}>
                        <label className={styles.nameOfInput}>Минимальный лимит
                            <input
                                type="text"
                                placeholder="Например: 2 кг"
                                value={positionLimit}
                                onChange={e => setPositionLimit(e.target.value)}
                                className={styles.textInput}
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


                    {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

                    <div className={styles.buttons}>
                        <button className={styles.cancelButton} onClick={() => {
                            onClose()
                            resetFields();
                        }}>Отмена</button>
                        <button className={styles.saveButton} disabled={!isFormValid()} onClick={handleSubmit}>Сохранить</button>
                    </div>
                </div>
            </div>
        )
    );
}

export default EditPositionModal;
