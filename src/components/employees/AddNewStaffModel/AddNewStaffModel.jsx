import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from "react-redux";
import styles from '../../branches/AddNewBranch/AddNewBranch.module.css';
import closeModal from "../../../img/X-black.svg";
import openDropdownVector from "../../../img/dropdownVectorOpen.svg";
import dropdownVector from "../../../img/dropdown-vector.svg";
import axios from "axios";
import {addNewStaffAdmin} from "../../../store/staffAdminSlice";

function AddNewStaffModel({ isVisible , onClose}) {
    const dispatch = useDispatch();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [positionName, setPositionName] = useState("");
    const [positionJob, setPositionJob] = useState("");
    const [positionDate, setPositionDate] = useState("");
    const [positionPhone, setPositionPhone] = useState("");
    const [showDropdown, setShowDropdown] = useState(true);
    const [positionBranch, setPositionBranch] = useState(null);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [branches, setBranches] = useState([]);
    const [branchAllocations, setBranchAllocations] = useState([{ branch: { id: null, name: '' }, amount: "" }]);
    const [showDropdownBranches, setShowDropdownBranches] = useState(false);
    const dropdownRef = useRef(null);
    const dropdownBranchesRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState({});
    const [schedule, setSchedule] = useState({
        monday: { isActive: false, from: "08:00", to: "17:00" },
        tuesday: { isActive: false, from: "08:00", to: "17:00" },
        wednesday: { isActive: false, from: "08:00", to: "17:00" },
        thursday: { isActive: false, from: "08:00", to: "17:00" },
        friday: { isActive: false, from: "08:00", to: "17:00" },
        saturday: { isActive: false, from: "08:00", to: "17:00" },
        sunday: { isActive: false, from: "08:00", to: "17:00" },
    });

    const daysOfWeek = [
        { key: 'monday', name: 'Понедельник' },
        { key: 'tuesday', name: 'Вторник' },
        { key: 'wednesday', name: 'Среда' },
        { key: 'thursday', name: 'Четверг' },
        { key: 'friday', name: 'Пятница' },
        { key: 'saturday', name: 'Суббота' },
        { key: 'sunday', name: 'Воскресенье' },
    ];


    const fetchBranches = async () => {
        try {
            const response = await axios.get('https://muha-backender.org.kg/branches/', {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });
            setBranches(response.data);
        } catch (error) {
            console.error('Ошибка при получении списка филиалов: ', error);
        }
    };

    useEffect(() => {
    }, [showDropdownBranches]);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
            if (dropdownBranchesRef.current && !dropdownBranchesRef.current.contains(event.target)) {
                setShowDropdownBranches(false);
            }
        };

        document.addEventListener('mousedown', handleDocumentClick);

        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, []);

    const toggleDropdownBranch = (index) => {
        fetchBranches();
        setDropdownOpen(prevState => ({
            ...prevState,
            [index]: !prevState[index],
        }));
    };
    useEffect(() => {
        setDropdownOpen(branchAllocations.reduce((acc, _, index) => ({ ...acc, [index]: false }), {}));
    }, [branchAllocations]);

    const handleBranchSelect = (branchId, branchName, index) => {
        setSelectedBranchId(branchId);
        setPositionBranch(branchName);
        setShowDropdownBranches(false);
    };



    const submitEmployeeData = async () => {
        // try {
        //     const accessToken = localStorage.getItem('accessToken');
        const formattedWorkdays = Object.entries(schedule)
            .filter(([_, daySchedule]) => daySchedule.isActive)
            .map(([dayKey, daySchedule]) => ({
                workday: convertDayToNumber(dayKey),
                start_time: daySchedule.from,
                end_time: daySchedule.to
            }));

        const employeeData = {
            username: login,
            password: password,
            first_name: positionName,
            position: convertPosition(positionJob),
            birth_date: positionDate,
            phone_number: formatPhoneNumber(positionPhone),
            branch: selectedBranchId ? parseInt(selectedBranchId) : null,
            workdays: formattedWorkdays
        };
        console.log('Отправляемые данные сотрудника:', employeeData);
        dispatch(addNewStaffAdmin(employeeData))
            .then(() => {
                console.log('Сотрудник успешно добавлен');
                resetFields();
                onClose();
            })
            .catch(error => {
                console.error('Ошибка при добавлении сотрудника:', error);
            });



        //     const response = await axios.post('https://muha-backender.org.kg/admin-panel/employees/create/', employeeData, {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${accessToken}`
        //         }
        //     });
        //     console.log(employeeData)
        //     resetFields();
        //     onClose();
        //     return response.data;
        // } catch (error) {
        //     console.error('Ошибка при создании сотрудника:', error.response.data);
        //     return null;
        // }
    };

    const formatPhoneNumber = (phoneNumber) => {
        return `+${phoneNumber}`;
    };

    const convertPosition = (position) => {
        if (position === 'Бармен') return 'barista';
        if (position === 'Официант') return 'waiter';
        return position;
    };

    const convertDayToNumber = (dayKey) => {
        const days = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 7 };
        return days[dayKey];
    };


    const isFormValid = () => {
        if (!login || !password || !positionName || !positionJob || !positionDate || !positionPhone ) {
            return false;
        }
        return true;
    };

    const resetFields = () => {
        setLogin("");
        setPassword("");
        setPositionName("");
        setPositionPhone("");
        setPositionDate("");
        setPositionJob("");
        setPositionBranch("");

    };

    const updateSchedule = (day, field, value) => {
        setSchedule(prevSchedule => ({
            ...prevSchedule,
            [day]: {
                ...prevSchedule[day],
                [field]: value,
            },
        }));
    };


    return (
        isVisible && (
            <div className={styles.modalOverlay}>
                <div className={styles.modalContainer}>
                    <div className={styles.titleModal}>
                        <h2 className={styles.title}>Новый сотрудник</h2>
                        <button className={styles.modalCloseButton} onClick={() => {
                            resetFields();
                            onClose();
                        }}>
                            <img src={closeModal} alt=""/>
                        </button>
                    </div>


                    <p className={styles.imageLabel}>Личные данные</p>
                    <label className={styles.nameOfInput}>Логин
                        <input
                            type="text"
                            placeholder="Придумайте логин"
                            value={login}
                            onChange={e => setLogin(e.target.value)}
                            className={styles.textInput}
                        />
                    </label>

                    <label className={styles.nameOfInput}>Пароль
                        <input
                            type="text"
                            placeholder="Придумайте пароль"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className={styles.textInput}
                        />
                    </label>

                    <label className={styles.nameOfInput}>Имя
                        <input
                            type="text"
                            placeholder="Как зовут сотрудника"
                            value={positionName}
                            onChange={e => setPositionName(e.target.value)}
                            className={styles.textInput}
                        />
                    </label>

                    <label className={styles.nameOfInput} htmlFor="">Должность
                        <select
                            value={positionJob}
                            onChange={e => setPositionJob(e.target.value)}
                            className={styles.textInput}
                        >
                            <option value="">Выберите должность</option>
                            <option value="barista">Бармен</option>
                            <option value="waiter">Официант</option>
                        </select>
                    </label>

                    <label className={styles.nameOfInput}>День рождения
                        <input
                            type="date"
                            placeholder="01.01.1991"
                            value={positionDate}
                            onChange={e => setPositionDate(e.target.value)}
                            className={styles.textInput}
                        />
                    </label>

                    <label className={styles.nameOfInput}>Номер телефона
                        <input
                            type="number"
                            placeholder="Введите номер телефона"
                            value={positionPhone}
                            onChange={e => setPositionPhone(e.target.value)}
                            className={styles.textInput}
                        />
                    </label>

                    {branchAllocations.map((allocation, index) => (
                        <div key={index} className={styles.categoryAndPrice}>
                            <label className={styles.nameOfInput}>Филиалы
                                <div className={styles.dropdown}>
                                    <button
                                        className={`${styles.dropdownButton} ${dropdownOpen[index] ? styles.dropdownButtonOpen : ''}`}
                                        onClick={() => toggleDropdownBranch(index)}
                                    >
                                        {positionBranch || "Выберите филиал"}
                                        <span className={styles.dropdownArrow}>
                                            <img src={dropdownOpen[index] ? openDropdownVector : dropdownVector} alt="" />
                                        </span>
                                    </button>
                                    {dropdownOpen[index] && (
                                        <div className={styles.dropdownMenu}>
                                            {branches.map((branch) => (
                                                <div
                                                    className={styles.dropdownItem}
                                                    key={branch.id}
                                                    onClick={() => handleBranchSelect(branch.id, branch.name_of_shop)}
                                                >
                                                    {branch.name_of_shop}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </label>
                        </div>
                    ))}

                    <p className={styles.imageLabel}>Заполните график работы</p>
                    <div className={styles.dayAndTime}>
                        <p className={styles.dayAndTimeTitle}>День недели</p>
                        <p className={styles.dayAndTimeTitle}>Время работы</p>
                    </div>
                    {daysOfWeek.map(({ key, name }) => (
                        <div key={key} className={styles.scheduleItem}>
                            <div>
                                <label className={styles.scheduleCheckbox}>
                                    {name}
                                    <input
                                        type="checkbox"
                                        checked={schedule[key].isActive}
                                        onChange={(e) => updateSchedule(key, 'isActive', e.target.checked)}
                                        className={styles.checkboxDay}
                                    />
                                </label>
                            </div>
                            <div className={styles.timeInputs}>
                                <input
                                    type="time"
                                    value={schedule[key].from}
                                    disabled={!schedule[key].isActive}
                                    onChange={(e) => updateSchedule(key, 'from', e.target.value)}
                                    className={styles.timeInput}
                                />
                                <span>-</span>
                                <input
                                    type="time"
                                    value={schedule[key].to}
                                    disabled={!schedule[key].isActive}
                                    onChange={(e) => updateSchedule(key, 'to', e.target.value)}
                                    className={styles.timeInput}
                                />
                            </div>
                        </div>
                    ))}

                    <div className={styles.buttons}>
                        <button className={styles.cancelButton} onClick={() => {
                            resetFields();
                            onClose();
                        }}>Отмена</button>
                        <button className={styles.saveButton}  disabled={!isFormValid()}  onClick={submitEmployeeData} >Создать</button>
                    </div>
                </div>
            </div>
        )
    );
}

export default AddNewStaffModel;
