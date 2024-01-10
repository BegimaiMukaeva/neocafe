import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../../store/warehouseAdminSlice';
import styles from "./WarehouseTableAdmin.module.css";
import dotsIcon from "../../../Assets/admin/admin/DotsThreeVertical.svg";
import EditDeleteItemModel from '../modalWarehouse/EditDeleteItemModel/EditDeleteItemModel';
import {Pagination} from "antd";

const WarehouseTableAdmin = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.warehouseAdmin.products);

    // const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [isOpenEditDeleteModal, setIsOpenEditDeleteModal] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);


    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
    };

    const currentItems = products ? products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

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
                {currentItems.map((product, index) => (
                    <tr key={product.id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{product.name}</td>
                        <td>{product.total_quantity} шт</td>
                        <td>{product.date_of_arrival}</td>
                        <td className={styles.table__branch}>
                            <img className={styles.dotsIcon} src={dotsIcon} alt="dots" onClick={() => openEditDeleteModal(product.id)}/>
                            <EditDeleteItemModel
                                isVisible={isOpenEditDeleteModal && product.id === currentItemId}
                                onClose={closeEditDeleteModal}
                                itemId={currentItemId}
                                itemType='ready-made-product'
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

export default WarehouseTableAdmin;
