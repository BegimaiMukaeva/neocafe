import React, { useState, useEffect } from "react";
import styles from "./WarehouseTableAdmin.module.css";
import {
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dotsIcon from "../../../Assets/admin/admin/DotsThreeVertical.svg";
import EditDeleteItemModel from '../modalWarehouse/EditDeleteItemModel/EditDeleteItemModel';

const staticData = [
  { id: "№1", name: "Круассан", quantity: "20 шт", limit: "10 шт", date: "20.09.2021" },
  { id: "№2", name: "Булочка с корицей", quantity: "20 шт", limit: "10 шт", date: "20.09.2021" },
  { id: "№3", name: "Булочка с корицей", quantity: "20 шт", limit: "10 шт", date: "20.09.2021" },
  { id: "№4", name: "Булочка с корицей", quantity: "20 шт", limit: "10 шт", date: "20.09.2021" },
  { id: "№5", name: "Булочка с корицей", quantity: "20 шт", limit: "10 шт", date: "20.09.2021" },
  { id: "№6", name: "Булочка с корицей", quantity: "20 шт", limit: "10 шт", date: "20.09.2021" },
];


const WarehouseTableAdmin = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [showDropdown, setShowDropdown] = useState(false);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = staticData.slice(indexOfFirstItem, indexOfLastItem);
  const [isOpenEditDeleteModal, setIsOpenEditDeleteModal] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);


  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < Math.ceil(staticData.length/ itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
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
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>№</th>
                <th>Наименование</th>
                <th className={styles.table__categoryTh}>Количество</th>
                <th>Лимит</th>
                <th>Дата прихода</th>
              </tr>
            </thead>
            <td colSpan="6">
              <div className={styles.table__hrLine}>
              </div>
            </td>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.limit}</td>
                  <td>{item.date}</td>
                  <td className={styles.table__branch}>
                    <img className={styles.dotsIcon} src={dotsIcon} alt="dots" onClick={() => openEditDeleteModal(item.id)}/>
                    <EditDeleteItemModel
                      isVisible={isOpenEditDeleteModal && item.id === currentItemId}
                      onClose={closeEditDeleteModal}
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
              length: Math.ceil(staticData.length / itemsPerPage),
            }).map((item, index) => (
              <button className={ index + 1 === currentPage ?  styles.activeNum : undefined} key={index} onClick={() => handlePaginationClick(index + 1)}>
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


