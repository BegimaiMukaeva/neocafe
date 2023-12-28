import React, {useEffect, useState, useRef} from 'react';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../../../store/warehouseAdminSlice';
import styles from './AddPositionModal.module.css';
import closeModalImg from "../../../../img/X-black.svg";
import plusSvg from "../../../../img/Plus-white.svg";
import openDropdownVector from "../../../../img/dropdownVectorOpen.svg";
import dropdownVector from "../../../../img/dropdown-vector.svg";
import axios from "axios";
import productImage from "../../../../img/CloudArrowUp.png";
import {fetchProducts} from "../../../../store/compositionMenuSlice";

function AddPositionModal({ isVisible, onClose }) {
    const dispatch = useDispatch();
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");
    const [categories, setCategories] = useState([]);
    const [positionName, setPositionName] = useState("");
    const [price, setPrice] = useState("");
    const [positionLimit, setPositionLimit] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
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
            quantity: Number(allocation.amount),
            minimal_limit: Number(positionLimit),
        }));

    const uploadImage = async (productId) => {
        const formData = new FormData();
        formData.append('image', image);

        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.put(`https://muha-backender.org.kg/admin-panel/ready-made-products/put-image-to-item/${productId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            dispatch(fetchProducts());
            console.log('Изображение успешно загружено');
            onClose ();
            resetFields();
        } catch (error) {
            console.error('Ошибка при загрузке изображения:', error);
        }
    };


    // const handleSubmit = () => {
    //     const productData = {
    //         name: positionName,
    //         category: productCategory,
    //         price: price,
    //         description: description,
    //         selectedCategoryId: selectedCategoryId,
    //         available_at_branches: availableAtBranches,
    //     };
    //     dispatch(addProduct(productData))
    //         .then(() => {
    //             onClose();
    //             resetFields();
    //         })
    //         .catch(error => {
    //             console.error('Ошибка при добавлении продукции:', error);
    //             setErrorMessage("Произошла ошибка при добавлении продукции.");
    //         });
    // };
    //

    const handleSubmit = async () => {
    const productData = {
        name: positionName,
        category: productCategory,
        price: price,
        description: description,
        selectedCategoryId: selectedCategoryId,
        available_at_branches: availableAtBranches,
    };

    try {
        const actionResult = await dispatch(addProduct(productData));
        const productId = actionResult.payload;

        if (productId && image) {
            await uploadImage(productId);
        }
        onClose();
        resetFields();
    } catch (error) {
        console.error('Ошибка при добавлении продукции:', error);
        setErrorMessage("Произошла ошибка при добавлении продукции.");
    }
};

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
                        <label className={styles.nameOfInput} htmlFor="">Категория
                            <select
                                value={selectedCategoryId}
                                onChange={e => {
                                    const selectedId = e.target.value;
                                    const selectedCat = categories.find(cat => cat.id.toString() === selectedId);
                                    setSelectedCategory(selectedCat ? selectedCat.name : '');
                                    setSelectedCategoryId(selectedId);
                                }}
                                className={styles.selectedInput}
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
                    {branchAllocations.map((allocation, index) => (
                        <div key={index}>
                            <div  className={styles.categoryAndPrice}>
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
                                        {dropdownOpen[index] && (
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
                    <button className={styles.addButton} onClick={addBranchAllocation}>
                        <img src={plusSvg} alt="Добавить" />
                        Добавить филиал
                    </button>

                    {/*{errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}*/}

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
