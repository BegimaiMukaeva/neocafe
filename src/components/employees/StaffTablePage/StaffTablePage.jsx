import React, { useState, useEffect } from "react";
import styles from "./StaffTablePage.module.css";
import {
  CaretDownOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import dotsIcon from "../../../Assets/admin/admin/DotsThreeVertical.svg";
import EditDeleteItemModel from '../EditDeleteItemModel/EditDeleteItemModel';
import axios from "axios";


const StaffTablePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [isOpenEditDeleteModal, setIsOpenEditDeleteModal] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [employees, setEmployees] = useState([]);


  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchResponse = await axios.get('https://muha-backender.org.kg/branches/', {
          headers: { 'accept': 'application/json' }
        });
        const branchesData = branchResponse.data.map(branch => ({ name: branch.name_of_shop, id: branch.id }));
        setBranches(branchesData);

        const employeeResponse = await axios.get('https://muha-backender.org.kg/admin-panel/employees/', {
          headers: { 'accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setEmployees(employeeResponse.data.map(employee => ({
          ...employee,
          position: convertPosition(employee.position),
          branchName: getBranchNameById(employee.branch, branchesData),
          schedule: formatSchedule(employee.schedule.workdays),
        })));
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };

    fetchBranches();
  }, []);

  const getBranchNameById = (branchId, branchesData) => {
    const branch = branchesData.find(b => b.id === branchId);
    return branch ? branch.name : 'Неизвестный филиал';
  };

  const handleCategorySelect = (branchName, branchId) => {
    setSelectedCategory(branchName);
    setSelectedBranchId(branchId);
    setShowDropdown(false);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://muha-backender.org.kg/admin-panel/employees/', {
          headers: { 'accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setEmployees(response.data.map(employee => ({
          ...employee,
          position: convertPosition(employee.position),
          branchName: getBranchNameById(employee.branch),
          schedule: formatSchedule(employee.schedule.workdays),
        })));
        console.log(response.data)
      } catch (error) {
        console.error('Ошибка при получении списка сотрудников:', error);
      }
    };

    fetchEmployees();
  }, []);

  const formatSchedule = (workdays) => {
    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return workdays
        .filter(day => day.start_time && day.end_time)
        .map(day => dayNames[day.workday - 1])
        .join(', ');
  };

  const convertPosition = (position) => {
    switch(position) {
      case 'barista': return 'Бармен';
      case 'waiter': return 'Официант';
      default: return position;
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
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
    if (currentPage < Math.ceil(setEmployees.length/ itemsPerPage)) {
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
      <div className={styles.main}>
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
            <th>Телефон</th>
            <th>График работы</th>
          </tr>
          </thead>
          <td colSpan="6">
            <div className={styles.table__hrLine}>
            </div>
          </td>
          <tbody>
          {employees.slice(indexOfFirstItem, indexOfLastItem).map((employee, index) => (
              <tr key={employee.id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{employee.first_name}</td>
                <td>{employee.position}</td>
                <td>{employee.branchName}</td>
                <td>{employee.phone_number}</td>
                <td>{employee.schedule}</td>
                <td className={styles.table__branch}>
                  <img className={styles.dotsIcon} src={dotsIcon} alt="dots" onClick={() => openEditDeleteModal(employee.id)} />
                  <EditDeleteItemModel
                      isVisible={isOpenEditDeleteModal && employee.id === currentItemId}
                      onClose={closeEditDeleteModal}
                      employeeId={employee.id}
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
            length: Math.ceil(employees.length / itemsPerPage),
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


