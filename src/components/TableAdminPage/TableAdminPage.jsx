import React, { useState } from "react";
import styles from "./TableAdminPage.module.css";
import {
  CaretDownOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dotsIcon from "../../Assets/admin/admin/DotsThreeVertical.svg"

const staticData = [
  {
    id: "№1",
    name: "Капучино",
    category: "Кофе",
    ingredients: "Молоко (70 мл), Кофе (15 зерен), Во...",
    price: "120px",
    branch: "№NeoCafe Dzerzhinka",
  },
  {
    id: "№2",
    name: "Latte",
    category: "Кофе",
    ingredients: "Молоко (70 мл), Кофе (15 зерен), Во...",
    price: "Молоко (70 мл), Кофе (15 зерен), Во...",
    branch: "№NeoCafe Dzerzhinka",
  },
  {
    id: "№3",
    name: "Americano",
    category: "Кофе",
    ingredients: "Молоко (70 мл), Кофе (15 зерен), Во...",
    price: "Молоко (70 мл), Кофе (15 зерен), Во...",
    branch: "№NeoCafe Dzerzhinka",
  },
  {
    id: "№4",
    name: "Starbucks",
    category: "Кофе",
    ingredients: "Молоко (70 мл), Кофе (15 зерен), Во...",
    price: "Молоко (70 мл), Кофе (15 зерен), Во...",
    branch: "№NeoCafe Dzerzhinka",
  },

  {
    id: "№5",
    name: "McCoffee",
    category: "Кофе",
    ingredients: "Молоко (70 мл), Кофе (15 зерен), Во...",
    price: "Молоко (70 мл), Кофе (15 зерен), Во...",
    branch: "№NeoCafe Dzerzhinka",
  },
];

const TableAdminPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Set the number of items per page

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

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>№</th>
            <th>Наименование</th>
            <th className={styles.table__categoryTh}>
              Категория <CaretDownOutlined className={styles.table__caretDown}/>
            </th>
            <th>Состав блюда и граммовка</th>
            <th>Стоимость</th>
            <th>
              Филиал <CaretDownOutlined />
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
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.ingredients}</td>
              <td>{item.price}</td>
              <td className={styles.table__branch}>{item.branch}
              <img src={dotsIcon} alt="dots" />
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

export default TableAdminPage;
