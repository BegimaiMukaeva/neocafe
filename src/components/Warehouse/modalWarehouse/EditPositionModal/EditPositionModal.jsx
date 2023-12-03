import React, { useState, useEffect } from 'react';
import styles from './EditPositionModal.module.css';
import closeModalImg from "../../../../img/X-black.svg";
import { useDispatch } from 'react-redux';
import {editItem} from '../../../../store/warehouseAdminSlice';
import axios from "axios";

function EditPositionModal({ isVisible, onClose, itemId, itemType, fetchIngredients, fetchProducts}) {
    const dispatch = useDispatch();
    const [positionName, setPositionName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const isFormValid = () => {
        return positionName;
    };


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
                    }
                    console.log(`Ответ сервера для ${itemType}:`, response.data);
                    const product = response.data.find(p => p.id === itemId);
                    if (product) {
                        setPositionName(product.name);
                    }

                })
                .catch(error => {
                    console.error(`Ошибка при получении данных для ${itemType}:`, error);
                });
        }
    }, [itemId, itemType]);

    const handleSubmit = () => {
        if (isFormValid()) {
            const updatedData = {
                name: positionName,
            };

            dispatch(editItem({ itemId, category: itemType, updatedData }));
            onClose();
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
