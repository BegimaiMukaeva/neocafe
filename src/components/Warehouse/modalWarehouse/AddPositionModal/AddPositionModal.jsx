import React, {useEffect, useState, useRef} from 'react';
import styles from './AddPositionModal.module.css';
import closeModalImg from "../../../../img/X-black.svg";
import plusSvg from "../../../../img/Plus-white.svg";
import openDropdownVector from "../../../../img/dropdownVectorOpen.svg";
import dropdownVector from "../../../../img/dropdown-vector.svg";
import axios from "axios";

function AddPositionModal({ isVisible, onClose }) {
    const [positionName, setPositionName] = useState("");
    const [positionLimit, setPositionLimit] = useState("");
    const [branchAllocations, setBranchAllocations] = useState([{ branch: { id: null, name: '' }, amount: "" }]);
    const [errorMessage, setErrorMessage] = useState("");
    const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
    const [productCategory, setProductCategory] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdownBranches, setShowDropdownBranches] = useState(false);
    const [branches, setBranches] = useState([]);
    const dropdownRef = useRef(null);
    const dropdownBranchesRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState({});


    const fetchBranches = async () => {
        try {
            const response = await axios.get('https://muha-backender.org.kg/branches/', {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });
            setBranches(response.data);
        } catch (error) {
            console.error('Ошибка при получении списка филиалов: ', error);
        }
    };

    useEffect(() => {
    }, [showDropdownBranches]);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (dropdownBranchesRef.current && !dropdownBranchesRef.current.contains(event.target)) {
                setShowDropdownBranches(false);
            }
        };

        document.addEventListener('mousedown', handleDocumentClick);

        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, []);

    const availableAtBranches = branchAllocations
        .filter(allocation => allocation.branch && allocation.branch.id && allocation.amount)
        .map(allocation => ({
            branch: allocation.branch.id,
            quantity: Number(allocation.amount)
        }));

    const handleSubmit = async () => {
        if (!positionName || !positionLimit || !productCategory) {
            setErrorMessage("Пожалуйста, заполните все поля.");
            if (availableAtBranches.length === 0) {
                setErrorMessage("Необходимо указать филиалы и количество.");
                return;
            }
            return;
        }

        // Validate the formatted data.
        if (availableAtBranches.some(ab => isNaN(ab.branch) || isNaN(ab.quantity))) {
            setErrorMessage("All branches must have a valid ID and quantity.");
            return;
        }

        let postData = {};
        let url = '';
        const accessToken = localStorage.getItem('accessToken');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        };

        if (productCategory === "Готовая продукция") {
            postData = {
                name: positionName,
                minimal_limit: Number(positionLimit),
                description: "Описание продукции",
                price: 120,
                available_at_branches: availableAtBranches
            };
            url = 'https://muha-backender.org.kg/admin-panel/ready-made-products/create/';
        } else if (productCategory === "Сырье") {
            const REAL_CATEGORY_ID_FOR_RAW_MATERIAL = 1;
            postData = {
                category: REAL_CATEGORY_ID_FOR_RAW_MATERIAL,
                name: positionName,
                measurement_unit: 'g',
                minimal_limit: Number(positionLimit),
                available_at_branches: availableAtBranches
            };
            url = 'https://muha-backender.org.kg/admin-panel/ingredients/create/';
        }

        try {
            const response = await axios.post(url, postData, { headers });

            if (response.status === 201) {
                console.log('Продукция успешно создана:', response.data);
                resetFields();
                onClose();
            } else {
                setErrorMessage("Произошла ошибка при создании продукции.");
            }
        } catch (error) {
            console.error('Ошибка при создании продукции:', error);
            const errorData = error.response && typeof error.response.data === 'object' ? JSON.stringify(error.response.data, null, 2) : error.response.data || "Произошла ошибка при создании продукции.";
            setErrorMessage(errorData);
        }
    };

    //
    // const toggleDropdownBranches = () => {
    //   if (!showDropdownBranches) {
    //     fetchBranches();
    //   }
    //   setShowDropdownBranches(!showDropdownBranches);
    //   if (showDropdown) {
    //     setShowDropdown(false);
    //   }
    // };

    const toggleDropdownBranch = (index) => {
        fetchBranches();
        setDropdownOpen(prevState => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };

    useEffect(() => {
        setDropdownOpen(branchAllocations.reduce((acc, _, index) => ({ ...acc, [index]: false }), {}));
    }, [branchAllocations]);

    const handleCategorySelect = (category) => {
        setProductCategory(category);
        setShowDropdown(false);
    };

    const handleBranchSelect = (branchId, branchName, index) => {
        const updatedAllocations = [...branchAllocations];
        updatedAllocations[index].branch = { id: branchId, name: branchName };
        setBranchAllocations(updatedAllocations);
    };
    const updateBranchQuantity = (index, amount) => {
        const updatedAllocations = [...branchAllocations];
        updatedAllocations[index].amount = amount;
        setBranchAllocations(updatedAllocations);
    };



    const addBranchAllocation = () => {
        setBranchAllocations([...branchAllocations, { branch: "", amount: "" }]);
    };

    const updateBranchAllocation = (index, field, value) => {
        const updatedAllocations = [...branchAllocations];
        if (field === "branch") {
            const selectedBranch = branches.find(branch => branch.id === Number(value));
            updatedAllocations[index].branch = selectedBranch || { id: null, name: '' };
        } else {
            updatedAllocations[index][field] = value;
        }
        setBranchAllocations(updatedAllocations);
    };



    const isFormValid = () => {
        return positionName && positionLimit;
    };


    const resetFields = () => {
        setPositionName("");
        setIngredients([{ name: "", amount: "" }]);
        setPositionLimit("");
        setBranchAllocations([{ branch: "", amount: "" }]);
        setErrorMessage("");
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

                    <div className={styles.category}>

                        {ingredients.map((ingredient, index) => (
                            <div key={index} className={styles.category}>
                                <div>
                                    <label className={styles.nameOfInput}>Категория
                                        <div className={styles.dropdown}>
                                            <button
                                                className={styles.dropdownButton}
                                                onClick={() => setShowDropdown(!showDropdown)}
                                            >
                                                {productCategory || "Выберите категорию"}
                                                <span className={styles.dropdownArrow}>
                                    <img src={showDropdownBranches ? openDropdownVector : dropdownVector} alt="" />
                                  </span>
                                            </button>
                                            {showDropdown && (
                                                <div className={styles.dropdownMenu}>
                                                    <div
                                                        className={styles.dropdownItem}
                                                        onClick={() => handleCategorySelect("Готовая продукция")}
                                                    >
                                                        Готовая продукция
                                                    </div>
                                                    <div
                                                        className={styles.dropdownItem}
                                                        onClick={() => handleCategorySelect("Сырье")}
                                                    >
                                                        Сырье
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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
                                className={styles.minimalLimit}
                            />
                        </label>
                    </div>
                    {branchAllocations.map((allocation, index) => (
                        <div key={index} className={styles.categoryAndPrice}>
                            <label className={styles.nameOfInput}>Филиалы
                                <div className={styles.dropdown}>
                                    <button
                                        className={`${styles.dropdownButton} ${dropdownOpen[index] ? styles.dropdownButtonOpen : ''}`}
                                        onClick={() => toggleDropdownBranch(index)} // Измените здесь
                                    >
                                        {allocation.branch.name || "Выберите филиал"}
                                        <span className={styles.dropdownArrow}>
            <img src={dropdownOpen[index] ? openDropdownVector : dropdownVector} alt="" />
          </span>
                                    </button>
                                    {dropdownOpen[index] && ( // И проверьте здесь
                                        <div className={styles.dropdownMenu}>
                                            {branches.map((branch) => (
                                                <div
                                                    className={styles.dropdownItem}
                                                    key={branch.id}
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        handleBranchSelect(branch.id, branch.name_of_shop, index);
                                                        setDropdownOpen(prevState => ({ ...prevState, [index]: false }));
                                                    }}
                                                >
                                                    {branch.name_of_shop}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </label>
                            <label className={styles.nameOfInput}>Количество
                                <input
                                    type="number"
                                    placeholder="Количество для филиала"
                                    value={allocation.amount}
                                    onChange={e => updateBranchQuantity(index, e.target.value)}
                                    className={styles.amountBranch}
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
                        <button className={styles.saveButton} disabled={!isFormValid()} onClick={handleSubmit}>Создать</button>
                    </div>
                </div>
            </div>
        )
    );
}

export default AddPositionModal;
