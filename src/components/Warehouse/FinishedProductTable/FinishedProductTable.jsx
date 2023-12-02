import React, { useState, useEffect } from "react";
import styles from "../WarehouseBalanceTable/WarehouseBalanceTable.module.css";
import {
  CaretDownOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import axios from "axios";


const FinishedProductTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = lowStockProducts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchResponse = await axios.get('https://muha-backender.org.kg/branches/', {
          headers: { 'accept': 'application/json' }
        });
        const branchesData = branchResponse.data.map(branch => ({ name: branch.name_of_shop, id: branch.id }));
        setBranches(branchesData);

      } catch (error) {
        console.error('Ошибка:', error);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranchId) {
      fetchLowStockProducts(selectedBranchId);
    }
  }, [selectedBranchId]);

  const fetchLowStockProducts = async (branchId) => {
    try {
      const response = await axios.get(`https://muha-backender.org.kg/admin-panel/low-stock-ingredient-branch/${branchId}/`, {
        headers: { 'accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setLowStockProducts(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Ошибка при получении данных о заканчивающихся продуктах:', error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCategorySelect = (branchName, branchId) => {
    setSelectedCategory(branchName);
    setSelectedBranchId(branchId);
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
    if (currentPage < Math.ceil(lowStockProducts.length/ itemsPerPage)) {
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
      <div className={styles.main}>
        <table className={styles.table}>
          <thead>
          <tr>
            <th>№</th>
            <th>Наименование</th>
            <th>Лимит</th>
            <th className={styles.table__categoryTh}>
              {selectedCategory || "Выберите филиал"}
              <span onClick={toggleDropdown}>
                    <CaretDownOutlined className={styles.table__caretDown}/>
                  </span>
              {showDropdown && (
                  <div className={styles.dropdown}>
                    {branches.map((branch) => (
                        <div
                            className={styles.menuCategory}
                            key={branch.id}
                            onClick={() => handleCategorySelect(branch.name, branch.id)}
                        >
                          {branch.name}
                        </div>
                    ))}
                  </div>
              )}
            </th>
          </tr>
          </thead>
          <td colSpan="6">
            <div className={styles.table__hrLine}>
            </div>
          </td>
          <tbody>
          {currentItems.map((item, index) => (
              <tr key={index}>
                <td>{index + 1 + indexOfFirstItem}</td>
                <td>{item.ingredient}</td>
                <td>{item.ingredient.minimal_limit} {item.ingredient.measurement_unit}</td>
                <td>{item.quantity} {item.ingredient.measurement_unit}</td>
              </tr>
          ))}
          </tbody>
        </table>
        <div className={styles.paginationContainer}>
          <button className={styles.leftBtn} onClick={handlePrevClick}>
            <LeftOutlined />
          </button>
          {Array.from({
            length: Math.ceil(lowStockProducts.length / itemsPerPage),
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

export default FinishedProductTable;


