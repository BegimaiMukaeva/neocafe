import React, { useState } from 'react';
import styles from './EditPositionModal.module.css';
import closeModalImg from "../../../../img/X-black.svg";

const staticData = {
  name: "Latte",
  category: "Кофе",
  limit: "10",
  ingredients: [
    { name: "Coffee", amount: "50" },
    { name: "Coffee", amount: "50" },
    { name: "Milk", amount: "200" }
  ]
};

function EditPositionModal({ isVisible, onClose }) {
  const [positionName, setPositionName] = useState(staticData.name);
  const [category, setCategory] = useState(staticData.category);
  const [positionLimit, setPositionLimit] = useState(staticData.limit);
  const [ingredients, setIngredients] = useState(staticData.ingredients);
  const [errorMessage, setErrorMessage] = useState("");

  const isFormValid = () => {
    return positionName && category && ingredients.every(i => i.name && i.amount);
  };

  const resetFields = () => {
    setPositionName(staticData.name);
    setCategory(staticData.category);
    setPositionLimit(staticData.limit);
    setIngredients(staticData.ingredients);
    setErrorMessage("");
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      console.log("Отправка данных:", { positionName, category, ingredients });
      resetFields();
      onClose();
    } else {
      setErrorMessage("Пожалуйста, заполните все поля.");
    }
  };

  return (
    isVisible && (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <div className={styles.titleModal}>
            <h2 className={styles.title}>Новая продукция</h2>
            <button className={styles.modalCloseButton} onClick={() => {
                resetFields();
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

            <div>
                {ingredients.map((ingredient, index) => (
                    <div key={index} className={styles.categoryAndPrice}>
                        <div>
                            <label className={styles.nameOfInput} htmlFor="">Категория
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className={styles.selectInputCategory}
                                >
                                    <option value="">Выберите категорию</option>
                                    <option value="Кофе">Кофе</option>
                                </select>
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
            </div>
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
            </div>


            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

             <div className={styles.buttons}>
                 <button className={styles.cancelButton} onClick={() => {
                     resetFields();
                     onClose();
                 }}>Отмена</button>
                 <button className={styles.saveButton} disabled={!isFormValid()}>Сохранить</button>
             </div>
        </div>
      </div>
    )
  );
}

export default EditPositionModal;
