import React, { useState, useEffect } from "react";
import styles from "../WarehouseBalanceTable/WarehouseBalanceTable.module.css";
import { CaretDownOutlined }
  from "@ant-design/icons";
import axios from "axios";
import {Pagination} from "antd";


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
    if (selectedBranchId !== branchId) {
      setSelectedBranchId(branchId);
      fetchLowStockProducts(branchId);
    }
    setShowDropdown(false);
  };

  useEffect(() => {
    if (selectedBranchId) {
      fetchLowStockProducts(selectedBranchId);
    }
  }, [selectedBranchId]);

  const filteredLowStockProducts = selectedBranchId
      ? lowStockProducts.filter(item => item.name_of_shop === selectedCategory)
      : lowStockProducts;

  // const currentItems = filteredLowStockProducts.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  const currentItems = filteredLowStockProducts ? filteredLowStockProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];


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
            <th>Остаток</th>
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
                <td>{item.ingredient_name}</td>
                <td>{item.min_limit}</td>
                <td>{item.quantity}</td>
              </tr>
          ))}
          </tbody>
        </table>
        <div className={styles.paginationContainer}>
          <Pagination
              current={currentPage}
              onChange={handlePageChange}
              total={filteredLowStockProducts.length}
              pageSize={itemsPerPage}
              hideOnSinglePage={true}
              itemRender={(current, type, originalElement) => {
                if (type === 'page') {
                  let element = null;
                  if (current === currentPage || current === currentPage - 1 || current === currentPage + 1) {
                    element = originalElement;
                  } else if (current === 1 || current === Math.ceil(filteredLowStockProducts.length / itemsPerPage)) {
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

export default FinishedProductTable;


