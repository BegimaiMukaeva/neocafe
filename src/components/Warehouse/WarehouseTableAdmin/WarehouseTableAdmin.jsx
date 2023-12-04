import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../../store/warehouseAdminSlice';
import styles from "./WarehouseTableAdmin.module.css";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dotsIcon from "../../../Assets/admin/admin/DotsThreeVertical.svg";
import EditDeleteItemModel from '../modalWarehouse/EditDeleteItemModel/EditDeleteItemModel';

const WarehouseTableAdmin = () => {
    const dispatch = useDispatch();
const products = useSelector((state) => state.warehouseAdmin.products);

  // const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [isOpenEditDeleteModal, setIsOpenEditDeleteModal] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const url = 'https://muha-backender.org.kg/admin-panel/ready-made-products/';
  //
  //     try {
  //       const accessToken = localStorage.getItem('accessToken');
  //       const response = await axios.get(url, {
  //         headers: {
  //           'Authorization': `Bearer ${accessToken}`
  //         }
  //       });
  //       setProducts(response.data);
  //       console.log( response.data);
  //     } catch (error) {
  //       console.error('Ошибка при получении продукции:', error);
  //     }
  //   };
  //
  //   fetchProducts();
  // }, []);


  // const fetchProducts = async () => {
  //   const url = 'https://muha-backender.org.kg/admin-panel/ready-made-products/';
  //   try {
  //     const accessToken = localStorage.getItem('accessToken');
  //     const response = await axios.get(url, {
  //       headers: {
  //         'Authorization': `Bearer ${accessToken}`
  //       }
  //     });
  //     setProducts(response.data);
  //     console.log(response.data)
  //   } catch (error) {
  //     console.error('Ошибка при получении ингредиентов:', error);
  //   }
  // };

 useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const currentItems = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePrevClick = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextClick = () => {
    setCurrentPage(prev => Math.min(prev + 1, Math.ceil(products.length / itemsPerPage)));
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
          {currentItems.map((product, index) => (
              <tr key={product.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{product.name}</td>
                <td>{product.total_quantity}</td>
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
          <button className={styles.leftBtn} onClick={handlePrevClick}>
            <LeftOutlined />
          </button>
          {Array.from({ length: Math.ceil(products.length / itemsPerPage) }, (_, index) => (
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

export default WarehouseTableAdmin;
