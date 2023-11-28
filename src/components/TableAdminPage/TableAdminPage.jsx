import React, { useState, useEffect } from "react";
import axios from 'axios';
import styles from "./TableAdminPage.module.css";
import {
    CaretDownOutlined,
    LeftOutlined,
    RightOutlined,
} from "@ant-design/icons";
import dotsIcon from "../../Assets/admin/admin/DotsThreeVertical.svg";
import AddNewCategory from '../../components/modalMenu/AddNewCategory/AddNewCategory';
import TrashSimple from '../../img/TrashSimple.svg';
import DeleteCategoryModal from '../modalMenu/DeleteCategoryModal/DeleteCategoryModal';
import EditDeleteItemModel from '../modalMenu/EditDeleteItemModel/EditDeleteItemModel';


const TableAdminPage = () => {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isOpenEditDeleteModal, setIsOpenEditDeleteModal] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
    const [categoryNameToDelete, setCategoryNameToDelete] = useState('');
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
    const fetchProducts = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get('https://muha-backender.org.kg/admin-panel/items/', {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            setProducts(response.data);
        } catch (error) {
            console.error('Ошибка при получении продуктов:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    useEffect(() => {
        fetchAvailableIngredients();
    }, []);

    useEffect(() => {
    }, [availableIngredients]);


    const getCompositionString = (composition) => {

        if (!composition || !Array.isArray(composition)) {
            return 'Нет данных о составе';
        }

        return composition.map(comp => {
            if (comp.ingredient === null) {
                return `Неизвестный ингредиент (${parseFloat(comp.quantity)} мл)`;
            }

            const ingredient = availableIngredients.find(ing => ing.id === comp.ingredient);
            const ingredientName = ingredient ? ingredient.name : 'Неизвестный ингредиент';
            return `${ingredientName} (${parseFloat(comp.quantity)} мл)`;
        }).join(', ');
    };


    const toggleDropdown = () => {
        if (!showDropdown) {
            fetchCategories();
        }
        setShowDropdown(!showDropdown);
    };

    useEffect(() => {
        if (!isModalOpen) {
            fetchCategories();
            setShowDropdown(false);
        }
    }, [isModalOpen]);

    const handleCategorySelect = (categoryName) => {
        setSelectedCategory(categoryName);
        setShowDropdown(false);
    };

    const handlePaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < Math.ceil(products.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const toggleModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    // const openDeleteModal = (category, event) => {
    //   event.stopPropagation();
    //   setCategoryToDelete(category);
    //   setIsDeleteModalOpen(true);
    //   // setShowDropdown(false);
    // };
    const openDeleteModal = (category, event) => {
        event.stopPropagation();
        setCategoryToDelete(category.name);
        setCategoryIdToDelete(category.id);
        setCategoryNameToDelete(category.name);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };
    const openEditDeleteModal = (itemId) => {
        setCurrentItemId(itemId);
        setIsOpenEditDeleteModal(true);
    }

    const closeEditDeleteModal = () => {
        setIsOpenEditDeleteModal(false);
    }

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (showDropdown && !event.target.closest(`.${styles.dropdown}`) && !event.target.closest(`.${styles.table__categoryTh}`)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleDocumentClick);

        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, [showDropdown, styles.dropdown, styles.table__categoryTh]);

    return (
        <div className={styles.main}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Наименование</th>
                    <th className={styles.table__categoryTh}>
                        {selectedCategory || "Категория"}
                        <span onClick={toggleDropdown}>
                    <CaretDownOutlined className={styles.table__caretDown}/>
                  </span>
                        {showDropdown && (
                            <div className={styles.dropdown}>
                                {categories.map((category) => (
                                    <div
                                        className={styles.menuCategory}
                                        key={category.id}
                                        onClick={() => handleCategorySelect(category.name)}
                                        onMouseEnter={() => setHoveredCategory(category.name)}
                                        onMouseLeave={() => setHoveredCategory(null)}
                                    >
                                        {category.name}
                                        {hoveredCategory === category.name && category.name !== "Категория" && (
                                            <img src={TrashSimple} alt="" onClick={(event) => openDeleteModal(category, event)}  />
                                        )}
                                        <DeleteCategoryModal
                                            isVisible={isDeleteModalOpen}
                                            onClose={closeDeleteModal}
                                            categoryId={categoryIdToDelete}
                                            categoryName={categoryNameToDelete}
                                        />
                                    </div>
                                ))}
                                <div className={styles.addCategoryIcon} onClick={toggleModal}>
                                    Добавить
                                </div>
                                <AddNewCategory
                                    isVisible={isModalOpen}
                                    onClose={handleCancel}
                                />
                            </div>
                        )}
                    </th>
                    <th>Состав блюда и граммовка</th>
                    <th>Стоимость</th>
                </tr>
                </thead>
                <td colSpan="6">
                    <div className={styles.table__hrLine}>
                    </div>
                </td>
                <tbody>
                {currentItems.map((item, index) => (
                    <tr key={item.id}>
                        <td>№{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                        <td>{item.name}</td>
                        <td>{item.category.name}</td>
                        <td>{getCompositionString(item.compositions)}</td>
                        <td>{item.price}</td>
                        <td className={styles.table__branch}>
                            <img className={styles.dotsIcon} src={dotsIcon} alt="dots" onClick={() => openEditDeleteModal(item.id)}/>
                            <EditDeleteItemModel
                                isVisible={isOpenEditDeleteModal && item.id === currentItemId}
                                onClose={closeEditDeleteModal}
                                itemId={item.id}
                                fetchProducts={fetchProducts}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className={styles.paginationContainer}>
                <button className={styles.leftBtn} onClick={handlePrevClick}>
                    <LeftOutlined />
                </button>
                {Array.from({
                    length: Math.ceil(products.length / itemsPerPage),
                }).map((_, index) => (
                    <button
                        className={index + 1 === currentPage ? styles.activeNum : undefined}
                        key={index}
                        onClick={() => handlePaginationClick(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button className={styles.rightBtn} onClick={handleNextClick}>
                    <RightOutlined />
                </button>
            </div>
        </div>
    );
};

export default TableAdminPage;


