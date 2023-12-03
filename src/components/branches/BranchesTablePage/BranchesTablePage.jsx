import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {fetchBranches} from "../../../store/branchesAdminSlice";
import styles from "./BranchesTablePage.module.css";
import {
    LeftOutlined,
    RightOutlined,
} from "@ant-design/icons";
import dotsIcon from "../../../Assets/admin/admin/DotsThreeVertical.svg";
import EditDeleteItemModel from '../EditDeleteItemModel/EditDeleteItemModel';


const BranchesTablePage = () => {
    const dispatch = useDispatch();
    const branches = useSelector((state) => state.branchesAdmin.branches);
    // const [branches, setBranches] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const [showDropdown, setShowDropdown] = useState(false);
    const [isOpenEditDeleteModal, setIsOpenEditDeleteModal] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);

    // const fetchBranches = async () => {
    //     try {
    //         const response = await axios.get('https://muha-backender.org.kg/branches/', {
    //             headers: {
    //                 'accept': 'application/json',
    //             }
    //         });
    //         setBranches(response.data);
    //     } catch (error) {
    //         console.error('Ошибка при получении данных о филиалах:', error);
    //     }
    // };
    useEffect(() => {
        dispatch(fetchBranches());
        }, [dispatch]);


    const handlePaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevClick = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < Math.ceil(branches.length/ itemsPerPage)) {
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = branches.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className={styles.main}>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Название кофейни</th>
                    <th className={styles.table__categoryTh}>Адрес</th>
                    <th>Время работы</th>
                </tr>
                </thead>
                <td colSpan="6">
                    <div className={styles.table__hrLine}>
                    </div>
                </td>
                <tbody>
                {branches.slice(indexOfFirstItem, indexOfLastItem).map((branch, index) => (
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
                <button className={styles.leftBtn} onClick={handlePrevClick}>
                    <LeftOutlined />
                </button>
                {Array.from({ length: Math.ceil(branches.length / itemsPerPage) }).map((_, index) => (
                    <button
                        className={index + 1 === currentPage ? styles.activeNum : undefined}
                        key={index}
                        onClick={() => handlePaginationClick(index + 1)}
                    >
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

export default BranchesTablePage;


