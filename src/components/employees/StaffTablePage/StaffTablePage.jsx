import React, { useState, useEffect } from "react";
import styles from "./StaffTablePage.module.css";
import {
  CaretDownOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dotsIcon from "../../../Assets/admin/admin/DotsThreeVertical.svg";
import EditDeleteItemModel from '../EditDeleteItemModel/EditDeleteItemModel';

const staticData = [
  { id: 1, name: 'Алихандро', position: 'Бармен', branch: 'NeoCafe Dzerzhinka', phone: '+996 (555) 231 234', schedule: 'Пн, Вт, Чт, Пт' },
  { id: 2, name: 'Алихандро', position: 'Официант', branch: 'NeoCafe Karpinka', phone: '+996 (552) 231 234', schedule: 'Пн, Вт, Чт, Пт' },
  { id: 3, name: 'Алихандро', position: 'Официант', branch: 'NeoCafe Karpinka', phone: '+996 (552) 231 234', schedule: 'Пн, Вт, Чт, Пт' },
  { id: 4, name: 'Алихандро', position: 'Официант', branch: 'NeoCafe Karpinka', phone: '+996 (552) 231 234', schedule: 'Пн, Вт, Чт, Пт' },
  { id: 5, name: 'Алихандро', position: 'Официант', branch: 'NeoCafe Karpinka', phone: '+996 (552) 231 234', schedule: 'Пн, Вт, Чт, Пт' },
  { id: 6, name: 'Алихандро', position: 'Официант', branch: 'NeoCafe Karpinka', phone: '+996 (552) 231 234', schedule: 'Пн, Вт, Чт, Пт' },
];
const categories = ["Выберите филиал", "NeoCafe Dzerzhinka", "NeoCafe Karpinka", "NeoCafe Filarmonia", "NeoCafe Bosteri", "NeoCafe Toktogula"];


const StaffTablePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = staticData.slice(indexOfFirstItem, indexOfLastItem);
  const [hoveredCategory, setHoveredCategory] = useState(null);
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
                <th>Имя</th>
                <th>Должность</th>
                <th className={styles.table__categoryTh}>
                  {selectedCategory || "Выберите филиал"}
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
                        >
                          {category}
                          {hoveredCategory === category && category !== "Выберите филиал" && ({category})}
                        </div>
                      ))}
                    </div>
                  )}
                </th>
                <th>Телефон</th>
                <th>График работы</th>
              </tr>
            </thead>
            <td colSpan="6">
              <div className={styles.table__hrLine}>
              </div>
            </td>
            <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.position}</td>
                    <td>{item.branch}</td>
                    <td>{item.phone}</td>
                    <td>{item.schedule}</td>
                    <td className={styles.table__branch}>
                      <img className={styles.dotsIcon} src={dotsIcon} alt="dots" onClick={() => openEditDeleteModal(item.id)} />
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

export default StaffTablePage;


