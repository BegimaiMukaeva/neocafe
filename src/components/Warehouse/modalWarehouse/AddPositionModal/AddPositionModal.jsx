import React, { useState } from 'react';
import styles from './AddPositionModal.module.css';
import closeModalImg from "../../../../img/X-black.svg";
import plusSvg from "../../../../img/Plus-white.svg";

function AddPositionModal({ isVisible, onClose }) {
  const [positionName, setPositionName] = useState("");
  const [category, setCategory] = useState("");
  const [positionLimit, setPositionLimit] = useState("");
  const [branchAllocations, setBranchAllocations] = useState([{ branch: "", amount: "" }]);
  const [errorMessage, setErrorMessage] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
  const addBranchAllocation = () => {
    setBranchAllocations([...branchAllocations, { branch: "", amount: "" }]);
  };

  const updateBranchAllocation = (index, field, value) => {
    const updatedAllocations = [...branchAllocations];
    updatedAllocations[index][field] = value;
    setBranchAllocations(updatedAllocations);
  };


  const isFormValid = () => {
      return positionName && category && positionLimit;
  };


  const resetFields = () => {
    setPositionName("");
    setCategory("");
    setIngredients([{ name: "", amount: "" }]);
    setPositionLimit("");
    setBranchAllocations([{ branch: "", amount: "" }]);
    setErrorMessage("");
  };


  const handleSubmit = () => {
    if (isFormValid()) {
      console.log("Отправка данных:", { positionName, category, positionLimit, branchAllocations });
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

            <div className={styles.categoryAndPrice}>
                {ingredients.map((ingredient, index) => (
                    <div key={index} className={styles.categoryAndPrice}>
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
            {branchAllocations.map((allocation, index) => (
            <div key={index} className={styles.categoryAndPrice}>
                <label className={styles.nameOfInput}>Филиал
                    <select
                        value={allocation.branch}
                        onChange={e => updateBranchAllocation(index, 'branch', e.target.value)}
                        className={styles.selectInputBranch}
                    >
                        <option value="">Выберите филиал</option>
                        <option value="Филиал 1">Филиал 1</option>
                        <option value="Филиал 2">Филиал 2</option>
                    </select>
                </label>
                <label className={styles.nameOfInput}>Количество
                    <input
                        type="number"
                        placeholder="Количество для филиала"
                        value={allocation.amount}
                        onChange={e => updateBranchAllocation(index, 'amount', e.target.value)}
                        className={styles.amountBranch}
                    />
                </label>
            </div>
            ))}
            <button className={styles.addButton} onClick={addBranchAllocation}>
                <img src={plusSvg} alt="Добавить" />
                Добавить филиал
            </button>

            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

             <div className={styles.buttons}>
                 <button className={styles.cancelButton} onClick={() => {
                     resetFields();
                     onClose();
                 }}>Отмена</button>
                 <button className={styles.saveButton} disabled={!isFormValid()}>Создать</button>
             </div>
        </div>
      </div>
    )
  );
}

export default AddPositionModal;
