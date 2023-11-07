import React, { useState, useEffect } from "react";
import styles from "./TableAdminPage.module.css";
import {
  CaretDownOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dotsIcon from "../../Assets/admin/admin/DotsThreeVertical.svg";
import AddNewCategory from '../../components/modalMenu/AddNewCategory/AddNewCategory';
import TrashSimple from '../../img/TrashSimple.svg';
import DeleteCategoryModal from '../modalMenu/DeleteCategoryModal/DeleteCategoryModal';
import EditDeleteItemModel from '../modalMenu/EditDeleteItemModel/EditDeleteItemModel';

const staticData = [
  {
    id: "№1",
    name: "Капучино",
    category: "Кофе",
    ingredients: "Молоко (70 мл), Кофе (15 зерен), Во...",
    price: "120 сом",
  },
  {
    id: "№2",
    name: "Latte",
    category: "Кофе",
    ingredients: "Молоко (70 мл), Кофе (15 зерен), Во...",
    price: "120 сом",
  },
  {
    id: "№3",
    name: "Americano",
    category: "Кофе",
    ingredients: "Молоко (70 мл), Кофе (15 зерен), Во...",
    price: "120 сом",
  },
  {
    id: "№4",
    name: "Starbucks",
    category: "Кофе",
    ingredients: "Молоко (70 мл), Кофе (15 зерен), Во...",
    price: "120 сом",
  },

  {
    id: "№5",
    name: "McCoffee",
    category: "Кофе",
    ingredients: "Молоко (70 мл), Кофе (15 зерен), Во...",
    price: "120 сом",
  },
];
const categories = ["Категория", "Кофе", "Десерты", "Коктейли", "Выпечка", "Чай"];


const TableAdminPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = staticData.slice(indexOfFirstItem, indexOfLastItem);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isOpenEditDeleteModal, setIsOpenEditDeleteModal] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
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
    if (currentPage < Math.ceil(staticData.length/ itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const toggleModal = () => {
    setIsModalOpen(true);
  };
   const handleCancel = () => {
     setIsModalOpen(false);
   };
  const openDeleteModal = (category, event) => {
    event.stopPropagation();
    setCategoryToDelete(category);
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
        <div>
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
                      {categories.map((category) => (
                        <div
                          className={styles.menuCategory}
                          key={category}
                          onClick={() => handleCategorySelect(category)}
                          onMouseEnter={() => setHoveredCategory(category)}
                          onMouseLeave={() => setHoveredCategory(null)}
                        >
                          {category}
                          {hoveredCategory === category && category !== "Категория" && (
                            <img src={TrashSimple} alt="" onClick={(event) => openDeleteModal(category, event)}  />
                          )}
                          <DeleteCategoryModal
                              isVisible={isDeleteModalOpen}
                              onClose={closeDeleteModal}
                              categoryName={categoryToDelete}
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

export default TableAdminPage;


