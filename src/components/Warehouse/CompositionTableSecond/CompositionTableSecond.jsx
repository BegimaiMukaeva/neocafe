import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchIngredients } from '../../../store/warehouseAdminSlice';
import styles from "../WarehouseTableAdmin/WarehouseTableAdmin.module.css";
import { Pagination } from 'antd';
import dotsIcon from "../../../Assets/admin/admin/DotsThreeVertical.svg";
import EditDeleteItemModel from '../modalWarehouse/EditDeleteItemModel/EditDeleteItemModel';

const CompositionTableSecond = () => {
    const dispatch = useDispatch();
    const ingredients = useSelector((state) => state.warehouseIngredientAdmin.ingredients);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [isOpenEditDeleteModal, setIsOpenEditDeleteModal] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);

    useEffect(() => {
        dispatch(fetchIngredients());
    }, [dispatch]);


    const getMeasurementUnitFull = (unit) => {
        const units = {
            'g': 'грамм',
            'kg': 'кг',
            'ml': 'мл',
            'l': 'литр'
        };
        return units[unit] || unit;
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
    };

    const currentItems = ingredients ? ingredients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

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
                        <td>{`${ingredient.total_quantity} ${getMeasurementUnitFull(ingredient.measurement_unit)}`}</td>
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
                <Pagination
                    current={currentPage}
                    onChange={handlePageChange}
                    total={ingredients.length}
                    pageSize={itemsPerPage}
                    hideOnSinglePage={true}
                    itemRender={(current, type, originalElement) => {
                        if (type === 'page') {
                            let element = null;
                            if (current === currentPage || current === currentPage - 1 || current === currentPage + 1) {
                                element = originalElement;
                            } else if (current === 1 || current === Math.ceil(ingredients.length / itemsPerPage)) {
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

export default CompositionTableSecond;
