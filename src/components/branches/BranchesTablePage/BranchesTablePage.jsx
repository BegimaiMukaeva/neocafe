import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {fetchBranches} from "../../../store/branchesAdminSlice";
import styles from "./BranchesTablePage.module.css";
import { Pagination } from 'antd';
import dotsIcon from "../../../Assets/admin/admin/DotsThreeVertical.svg";
import EditDeleteItemModel from '../EditDeleteItemModel/EditDeleteItemModel';

const BranchesTablePage = () => {
    const dispatch = useDispatch();
    const branches = useSelector(state => state.branchesAdmin);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [showDropdown, setShowDropdown] = useState(false);
    const [isOpenEditDeleteModal, setIsOpenEditDeleteModal] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    useEffect(() => {
        dispatch(fetchBranches());
    }, [dispatch]);


    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
    };

    const currentItems = branches ? branches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : [];

    const openEditDeleteModal = (itemId) => {
        setCurrentItemId(itemId);
        setIsOpenEditDeleteModal(true);
    }

    const closeEditDeleteModal = () => {
        setIsOpenEditDeleteModal(false);
    }

    const formatWorkingHours = (workdays) => {
        if (!workdays || workdays.length === 0) {
            return "График работы не указан";
        }

        const daysOfWeek = [
            { key: 'monday', name: 'Пн', number: 1 },
            { key: 'tuesday', name: 'Вт', number: 2 },
            { key: 'wednesday', name: 'Ср', number: 3 },
            { key: 'thursday', name: 'Чт', number: 4 },
            { key: 'friday', name: 'Пт', number: 5 },
            { key: 'saturday', name: 'Сб', number: 6 },
            { key: 'sunday', name: 'Вс', number: 7 },
        ];

        const allDaysSame = workdays.every(day =>
            day.start_time === workdays[0].start_time && day.end_time === workdays[0].end_time
        );

        if (allDaysSame && workdays.length === 7) {
            return `Каждый день с ${workdays[0].start_time.substring(0, 5)} до ${workdays[0].end_time.substring(0, 5)}`;
        }

        let scheduleDescription = '';
        workdays.forEach(day => {
            const dayName = daysOfWeek.find(d => d.number === day.workday).name;
            scheduleDescription += `${dayName} с ${day.start_time.substring(0, 5)} до ${day.end_time.substring(0, 5)}, `;
        });

        return scheduleDescription.slice(0, -2);
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
                    <th>Название кофейни</th>
                    <th className={styles.table__categoryTh}>Адрес</th>
                    <th>Время работы</th>
                    <th>Ред.</th>
                </tr>
                </thead>
                <td colSpan="6">
                    <div className={styles.table__hrLine}>
                    </div>
                </td>
                <tbody>
                {currentItems.map((branch, index) => (
                    <tr key={branch.id}>
                        <td>{indexOfFirstItem + index + 1}</td>
                        <td>{branch.name_of_shop}</td>
                        <td>{branch.address}</td>
                        <td>
                            {formatWorkingHours(branch.workdays)}
                        </td>
                        <td className={styles.table__branch}>
                            <img
                                className={styles.dotsIcon}
                                src={dotsIcon}
                                alt="dots"
                                onClick={() => openEditDeleteModal(branch.id)}
                            />
                            <EditDeleteItemModel
                                isVisible={isOpenEditDeleteModal && currentItemId === branch.id}
                                onClose={closeEditDeleteModal}
                                branchId={branch.id}
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
                    total={branches.length}
                    pageSize={itemsPerPage}
                    hideOnSinglePage={true}
                    itemRender={(current, type, originalElement) => {
                        if (type === 'page') {
                            let element = null;
                            if (current === currentPage || current === currentPage - 1 || current === currentPage + 1) {
                                element = originalElement;
                            } else if (current === 1 || current === Math.ceil(branches.length / itemsPerPage)) {
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

export default BranchesTablePage;


