import React, { useState, useEffect } from "react";
import styles from "./WarehouseBalanceTable.module.css";
import {
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

const staticData = [
  {
    id: '№1',
    name: 'Круассан',
    NeoCafeDzerzhinka: '20 шт',
    NeoCafeKarpinka: '20 шт',
    NeoCafeBosteri: '10 шт',
    NeoCafeFilial: '0'
  },
  {
    id: '№2',
    name: 'Булочка с корицей',
    NeoCafeDzerzhinka: '0 шт',
    NeoCafeKarpinka: '10 шт',
    NeoCafeBosteri: '20 шт',
    NeoCafeFilial: '0'
  },
  {
    id: '№3',
    name: 'Шарлотка с яблоком',
    NeoCafeDzerzhinka: '20 шт',
    NeoCafeKarpinka: '10 шт',
    NeoCafeBosteri: '15 шт',
    NeoCafeFilial: '0'
  },
  {
    id: '№4',
    name: 'Сырные крекеры',
    NeoCafeDzerzhinka: '20 шт',
    NeoCafeKarpinka: '10 шт',
    NeoCafeBosteri: '12 шт',
    NeoCafeFilial: '0'
  },
  {
    id: '№5',
    name: 'Чизкейк',
    NeoCafeDzerzhinka: '30 шт',
    NeoCafeKarpinka: '10 шт',
    NeoCafeBosteri: '13 шт',
    NeoCafeFilial: '0'
  },
  {
    id: '№6',
    name: 'Брауни',
    NeoCafeDzerzhinka: '10 шт',
    NeoCafeKarpinka: '20 шт',
    NeoCafeBosteri: '0',
    NeoCafeFilial: '0'
  }
];


const WarehouseBalanceTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [showDropdown, setShowDropdown] = useState(false);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = staticData.slice(indexOfFirstItem, indexOfLastItem);

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
                <th>NeoCafeDzerzhinka</th>
                <th>NeoCafeKarpinka</th>
                <th>NeoCafeBosteri</th>
                <th>NeoCafeFilial</th>
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
                  <td>{item.NeoCafeDzerzhinka}</td>
                  <td>{item.NeoCafeKarpinka}</td>
                  <td>{item.NeoCafeBosteri}</td>
                  <td>{item.NeoCafeFilial}</td>
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

export default WarehouseBalanceTable;


