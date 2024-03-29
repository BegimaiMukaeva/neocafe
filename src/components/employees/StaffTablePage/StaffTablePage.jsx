import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchStaff } from '../../../store/staffAdminSlice';
import {setStaffs} from '../../../store/staffAdminSlice';
import { Pagination } from 'antd';
import {updateEmployees} from '../../../store/staffAdminSlice';
import styles from "./StaffTablePage.module.css";
import {
  CaretDownOutlined,
} from "@ant-design/icons";
import dotsIcon from "../../../Assets/admin/admin/DotsThreeVertical.svg";
import EditDeleteItemModel from '../EditDeleteItemModel/EditDeleteItemModel';
import axios from "axios";


const StaffTablePage = () => {
  const dispatch = useDispatch();
  const employees = useSelector(state => state.staffAdmin);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const currentItems = employees ? employees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const [isOpenEditDeleteModal, setIsOpenEditDeleteModal] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);


  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };


  // useEffect(() => {
  //       dispatch(fetchStaff());
  //   const fetchBranches = async () => {
  //     try {
  //       const branchResponse = await axios.get('https://muha-backender.org.kg/branches/', {
  //         headers: { 'accept': 'application/json' }
  //       });
  //       const branchesData = branchResponse.data.map(branch => ({ name: branch.name_of_shop, id: branch.id }));
  //       setBranches(branchesData);
  //
  //       const employeeResponse = await axios.get('https://muha-backender.org.kg/admin-panel/employees/', {
  //         headers: { 'accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
  //       });
  //       setEmployees(employeeResponse.data.map(employee => ({
  //         ...employee,
  //         position: convertPosition(employee.position),
  //         branchName: getBranchNameById(employee.branch, branchesData),
  //         schedule: formatSchedule(employee.schedule.workdays),
  //       })));
  //     } catch (error) {
  //       console.error('Ошибка:', error);
  //     }
  //   };
  //
  //   fetchBranches();
  // }, [dispatch]);


  useEffect(() => {
    dispatch(fetchStaff());
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
  }, [dispatch]);


  // const formatSchedule = (workdays) => {
  //   const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  //   return workdays
  //       .filter(day => day.start_time && day.end_time)
  //       .map(day => dayNames[day.workday - 1])
  //       .join(', ');
  // };

  const fetchEmployeesByBranch = async (branchId) => {
    let url = 'https://muha-backender.org.kg/admin-panel/employees/';
    if (branchId && branchId !== 'Все филиалы') {
      url += `?branch=${branchId}`;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      dispatch(setStaffs(response.data));
    } catch (error) {
      console.error('Ошибка при получении списка сотрудников:', error);
    }
  };


  useEffect(() => {
    fetchEmployeesByBranch(selectedCategory);
  }, [selectedCategory]);


  function getBranchNameById(branchId, branchesData) {
    const branch = branchesData.find(b => b.id === branchId);
    return branch ? branch.name : 'Неизвестный филиал';
  }

  const handleCategorySelect = (branchName, branchId) => {
    setSelectedCategory(branchName);
    setSelectedBranchId(branchId === 'Все филиалы' ? '' : branchId);
    setShowDropdown(false);
    fetchEmployeesByBranch(branchId === 'Все филиалы' ? '' : branchId);
  };


  const formatSchedule = (workdays) => {
    if (!workdays || workdays.length === 0) return 'Нет графика';
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

  //
  // useEffect(() => {
  //   const fetchEmployees = async () => {
  //     try {
  //       const response = await axios.get('https://muha-backender.org.kg/admin-panel/employees/', {
  //         headers: { 'accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
  //       });
  //       setEmployees(response.data.map(employee => ({
  //         ...employee,
  //         position: convertPosition(employee.position),
  //         branchName: getBranchNameById(employee.branch),
  //         schedule: formatSchedule(employee.schedule.workdays),
  //       })));
  //       console.log(response.data)
  //     } catch (error) {
  //       console.error('Ошибка при получении списка сотрудников:', error);
  //     }
  //   };
  //
  //   fetchEmployees();
  // }, []);


  // const formatSchedule = (workdays) => {
  //   const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  //   return workdays
  //       .filter(day => day.start_time && day.end_time)
  //       .map(day => dayNames[day.workday - 1])
  //       .join(', ');
  // };
  //
  // const convertPosition = (position) => {
  //   switch(position) {
  //     case 'barista': return 'Бармен';
  //     case 'waiter': return 'Официант';
  //     default: return position;
  //   }
  // };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
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
                    <div
                        className={styles.menuCategory}
                        key="all-branches"
                        onClick={() => handleCategorySelect('Все филиалы', '')}
                    >
                      Все филиалы
                    </div>
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
            <th>Ред.</th>
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
                <td>{convertPosition(employee.position)}</td>
                <td>{getBranchNameById(employee.branch, branches)}</td>
                <td>{employee.phone_number}</td>
                <td>{formatSchedule(employee.schedule.workdays)}</td>
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
          <Pagination
              current={currentPage}
              onChange={handlePageChange}
              total={employees.length}
              pageSize={itemsPerPage}
              hideOnSinglePage={true}
              itemRender={(current, type, originalElement) => {
                if (type === 'page') {
                  let element = null;
                  if (current === currentPage || current === currentPage - 1 || current === currentPage + 1) {
                    element = originalElement;
                  } else if (current === 1 || current === Math.ceil(employees.length / itemsPerPage)) {
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

export default StaffTablePage;


