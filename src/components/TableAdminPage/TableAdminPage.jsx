import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setProducts } from '../../store/compositionMenuSlice';
import styles from "./TableAdminPage.module.css";
import {
    CaretDownOutlined,
} from "@ant-design/icons";
import dotsIcon from "../../Assets/admin/admin/DotsThreeVertical.svg";
import AddNewCategory from '../../components/modalMenu/AddNewCategory/AddNewCategory';
import TrashSimple from '../../img/TrashSimple.svg';
import DeleteCategoryModal from '../modalMenu/DeleteCategoryModal/DeleteCategoryModal';
import EditDeleteItemModel from '../modalMenu/EditDeleteItemModel/EditDeleteItemModel';
import {Pagination} from "antd";


const TableAdminPage = () => {
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const products = useSelector(state => state.compositionMenu);


    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const currentItems = products ? products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

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

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
    };

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

    const fetchProducts = async (categoryName = '') => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const url = categoryName
                ? `https://muha-backender.org.kg/admin-panel/items/?category__name=${categoryName}`
                : 'https://muha-backender.org.kg/admin-panel/items/';

            const response = await axios.get(url, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            dispatch(setProducts(response.data));
        } catch (error) {
            console.error('Ошибка при получении продуктов:', error);
        }
    };

    useEffect(() => {
        fetchProducts(selectedCategory);
    }, [selectedCategory]);

    const handleCategorySelect = (categoryName) => {
        setSelectedCategory(categoryName);
        setShowDropdown(false);

        fetchProducts(categoryName === 'Все категории' ? '' : categoryName);
    };

    useEffect(() => {
        fetchAvailableIngredients();
    }, []);

    useEffect(() => {
    }, [availableIngredients]);


    useEffect(() => {
        console.log('Текущие продукты в компоненте:', products);
    }, [products]);

    const getCompositionString = (composition) => {

        if (!composition || !Array.isArray(composition)) {
            return 'Нет данных о составе';
        }

        return composition.map(comp => {
            if (comp.ingredient === null) {
                return `Неизвестный ингредиент (${parseFloat(comp.quantity)} мл/г)`;
            }

            const ingredient = availableIngredients.find(ing => ing.id === comp.ingredient);
            const ingredientName = ingredient ? ingredient.name : 'Неизвестный ингредиент';
            return `${ingredientName} (${parseFloat(comp.quantity)} мл/г)`;
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


    const toggleModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
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
                                <div
                                    className={styles.menuCategory}
                                    key="all-categories"
                                    onClick={() => handleCategorySelect('Все категории')}
                                >
                                    Все категории
                                </div>
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
                    <th>Ред.</th>
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
                <Pagination
                    current={currentPage}
                    onChange={handlePageChange}
                    total={products.length}
                    pageSize={itemsPerPage}
                    hideOnSinglePage={true}
                    itemRender={(current, type, originalElement) => {
                        if (type === 'page') {
                            let element = null;
                            if (current === currentPage || current === currentPage - 1 || current === currentPage + 1) {
                                element = originalElement;
                            } else if (current === 1 || current === Math.ceil(products.length / itemsPerPage)) {
                                element = originalElement;
                            } else {
                                if (Math.abs(current - currentPage) === 2) {
                                    element = <span>...</span>;
                                } else {
                                    element = <span style={{ display: 'none' }}>...</span>;
                                }
                            }
                            return element;
                        }
                        return originalElement;
                    }}
                />

            </div>
        </div>
    );
};

export default TableAdminPage;


