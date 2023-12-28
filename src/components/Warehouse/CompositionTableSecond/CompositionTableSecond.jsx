import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { fetchIngredients } from '../../../store/warehouseAdminSlice';
import styles from "../WarehouseTableAdmin/WarehouseTableAdmin.module.css";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dotsIcon from "../../../Assets/admin/admin/DotsThreeVertical.svg";
import EditDeleteItemModel from '../modalWarehouse/EditDeleteItemModel/EditDeleteItemModel';

const CompositionTableSecond = () => {
    const dispatch = useDispatch();
    const ingredients = useSelector((state) => state.warehouseIngredientAdmin.ingredients);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [isOpenEditDeleteModal, setIsOpenEditDeleteModal] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);

    // useEffect(() => {
    //   const fetchIngredients = async () => {
    //     const url = 'https://muha-backender.org.kg/admin-panel/ingredients/';
    //     try {
    //       const accessToken = localStorage.getItem('accessToken');
    //       const response = await axios.get(url, {
    //         headers: {
    //           'Authorization': `Bearer ${accessToken}`
    //         }
    //       });
    //       setIngredients(response.data);
    //       console.log(response.data)
    //     } catch (error) {
    //       console.error('Ошибка при получении ингредиентов:', error);
    //     }
    //   };
    //
    //   fetchIngredients();
    // }, []);

    // const fetchIngredients = async () => {
    //   const url = 'https://muha-backender.org.kg/admin-panel/ingredients/';
    //   try {
    //     const accessToken = localStorage.getItem('accessToken');
    //     const response = await axios.get(url, {
    //       headers: {
    //         'Authorization': `Bearer ${accessToken}`
    //       }
    //     });
    //     setIngredients(response.data);
    //     console.log(response.data)
    //   } catch (error) {
    //     console.error('Ошибка при получении ингредиентов:', error);
    //   }
    // };

    useEffect(() => {
        dispatch(fetchIngredients());
    }, [dispatch]);

    const currentItems = ingredients ? ingredients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

    const handlePrevClick = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextClick = () => {
        setCurrentPage(prev => Math.min(prev + 1, Math.ceil(ingredients.length / itemsPerPage)));
    };

    const openEditDeleteModal = (itemId) => {
        setCurrentItemId(itemId);
        setIsOpenEditDeleteModal(true);
    };

    const closeEditDeleteModal = () => {
        setIsOpenEditDeleteModal(false);
    };

    return (
        <div className={styles.main}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Наименование</th>
                    <th>Количество</th>
                    <th>Дата прихода</th>
                    <th>Ред.</th>
                </tr>
                </thead>
                <td colSpan="6">
                    <div className={styles.table__hrLine}>
                    </div>
                </td>
                <tbody>
                {currentItems.map((ingredient, index) => (
                    <tr key={ingredient.id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{ingredient.name}</td>
                        <td>{`${ingredient.total_quantity}`}</td>
                        <td>{ingredient.date_of_arrival}</td>
                        <td className={styles.table__branch}>
                            <img className={styles.dotsIcon} src={dotsIcon} alt="dots" onClick={() => openEditDeleteModal(ingredient.id)}/>
                            <EditDeleteItemModel
                                isVisible={isOpenEditDeleteModal && ingredient.id === currentItemId}
                                onClose={closeEditDeleteModal}
                                itemId={currentItemId}
                                itemType='ingredient'
                                // fetchIngredients={fetchIngredients}
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
                {Array.from({ length: Math.ceil(ingredients.length / itemsPerPage) }, (_, index) => (
                    <button
                        className={currentPage === index + 1 ? styles.activeNum : undefined}
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
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

export default CompositionTableSecond;
