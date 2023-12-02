import React, {useEffect, useRef, useState} from 'react';
import styles from '../../branches/AddNewBranch/AddNewBranch.module.css';
import closeModal from "../../../img/X-black.svg";
import axios from "axios";
import openDropdownVector from "../../../img/dropdownVectorOpen.svg";
import dropdownVector from "../../../img/dropdown-vector.svg";

function EditStaffModel({ isVisible , onClose, employeeId }) {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [positionName, setPositionName] = useState('');
    const [positionJob, setPositionJob] = useState('');
    const [positionDate, setPositionDate] = useState('');
    const [positionPhone, setPositionPhone] = useState('');
    const [positionBranch, setPositionBranch] = useState('');
    const [schedule, setSchedule] = useState('');
    const [branches, setBranches] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [showDropdown, setShowDropdown] = useState(true);
    const dropdownRef = useRef(null);
    const dropdownBranchesRef = useRef(null);
    const [showDropdownBranches, setShowDropdownBranches] = useState(false);

    const initialSchedule = {
        monday: { isActive: false, from: '08:00', to: '17:00' },
        tuesday: { isActive: false, from: '08:00', to: '17:00' },
        wednesday: { isActive: false, from: '08:00', to: '17:00' },
        thursday: { isActive: false, from: '08:00', to: '17:00' },
        friday: { isActive: false, from: '08:00', to: '17:00' },
        saturday: { isActive: false, from: '08:00', to: '17:00' },
        sunday: { isActive: false, from: '08:00', to: '17:00' },
    };

    const daysOfWeek = [
        { key: 'monday', name: 'Понедельник' },
        { key: 'tuesday', name: 'Вторник' },
        { key: 'wednesday', name: 'Среда' },
        { key: 'thursday', name: 'Четверг' },
        { key: 'friday', name: 'Пятница' },
        { key: 'saturday', name: 'Суббота' },
        { key: 'sunday', name: 'Воскресенье' },
    ];
    const updatedSchedule = { ...initialSchedule };

    const dayMapping = {
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday',
        7: 'sunday',
    };

    useEffect(() => {
        fetchBranches().then(fetchedBranches => {
            if (employeeId) {
                fetchEmployeeData(employeeId, fetchedBranches);
            }
        }).catch(error => {
            console.error('Ошибка при загрузке данных: ', error);
        });
    }, [employeeId]);


    const fetchBranches = async () => {
        try {
            const response = await axios.get('https://muha-backender.org.kg/branches/', {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });
            setBranches(response.data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении списка филиалов: ', error);
            throw error;
        }
    };



    const fetchEmployeeData = async (employeeId, branches) => {
        try {
            const response = await axios.get(`https://muha-backender.org.kg/admin-panel/employees/${employeeId}/`, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });
            const employee = response.data;
            console.log(response.data)
            setLogin(employee.username);
            setPassword(employee.password);
            setPositionName(employee.first_name);
            setPositionJob(convertPositionForDisplay(employee.position));
            setPositionDate(employee.birth_date);
            setPositionPhone(parseFloat(employee.phone_number));

            const branch = branches.find(branch => branch.id === employee.branch);
            setPositionBranch(branch ? branch.name_of_shop : '');

            employee.schedule.workdays.forEach(day => {
                const dayKey = dayMapping[day.workday];
                if (dayKey) {
                    updatedSchedule[dayKey] = {
                        isActive: true,
                        from: day.start_time.slice(0, 5),
                        to: day.end_time.slice(0, 5),     // Преобразование '17:00:00' в '17:00'
                    };
                }
            });

            setSchedule(updatedSchedule);
        } catch (error) {
            console.error('Ошибка при получении данных сотрудника: ', error);
        }
    };
    useEffect(() => {
        fetchBranches().then(() => {
            if (employeeId) {
                fetchEmployeeData();
            }
        });
    }, [employeeId]);




    const saveUpdatedEmployeeData = async () => {
        const updatedEmployeeData = {
            username: login,
            first_name: positionName,
            position: convertPositionForKey(positionJob),
            birth_date: positionDate,
            phone_number: formatPhoneNumber(positionPhone),
            branch: parseInt(selectedBranchId),
        };

        try {
            const response = await axios.patch(`https://muha-backender.org.kg/admin-panel/employees/update/${employeeId}/`, updatedEmployeeData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });

            console.log('Обновленные данные сотрудника:', response.data);
            if (response.status === 200) {
                await saveUpdatedWorkSchedule();
            }
        } catch (error) {
            console.error('Ошибка при обновлении данных сотрудника:', error.response?.data || error.message);
        }
    };


    const saveUpdatedWorkSchedule = async () => {
        const formattedWorkdays = Object.entries(schedule)
            .filter(([_, value]) => value.isActive)
            .map(([key, value]) => ({
                workday: convertDayToNumber(key),
                start_time: value.from,
                end_time: value.to,
            }));

        try {
            const scheduleData = {
                workdays: formattedWorkdays,
            };

            const response = await axios.patch(`https://muha-backender.org.kg/admin-panel/employees/schedule/update/${employeeId}/`, scheduleData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                }
            });
            onClose();
            console.log('Обновленный график работы сотрудника:', response.data);
        } catch (error) {
            console.error('Ошибка при обновлении графика работы сотрудника:', error.response?.data || error.message);
        }
    };

    const convertDayToNumber = (dayKey) => {
        const days = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 7 };
        return days[dayKey];
    };
    const formatPhoneNumber = (phoneNumber) => {
        return `+${phoneNumber}`;
    };

    const convertPositionForDisplay = (positionKey) => {
        if (positionKey === 'barista') return 'Бармен';
        if (positionKey === 'waiter') return 'Официант';
        return positionKey;
    };

    const convertPositionForKey = (positionDescription) => {
        if (positionDescription === 'Бармен') return 'barista';
        if (positionDescription === 'Официант') return 'waiter';
        return positionDescription;
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleBranchSelect = (branchId, branchName) => {
        setSelectedBranchId(branchId);
        setPositionBranch(branchName);
        setDropdownOpen(false);
    };



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



    const isFormValid = () => {
        if ( !login || !password || !positionName || !positionJob || !positionDate || !positionPhone || !positionBranch ) {
            return false;
        }
        return true;
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
                            type=""
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
                            <option value="Бармен">Бармен</option>
                            <option value="Официант">Официант</option>
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
                    <label htmlFor="">Филиал
                        <div className={styles.dropdown}>
                            <button className={`${styles.dropdownButton} ${dropdownOpen ? styles.dropdownButtonOpen : ''}`} onClick={toggleDropdown}>
                                {positionBranch || "Выберите филиал"}
                                <span className={styles.dropdownArrow}>
                                <img src={dropdownOpen ? openDropdownVector : dropdownVector} alt="" />
                            </span>
                            </button>
                            {dropdownOpen && (
                                <div className={styles.dropdownMenu}>
                                    {branches.map(branch => (
                                        <div key={branch.id} className={styles.dropdownItem} onClick={() => handleBranchSelect(branch.id, branch.name_of_shop)}>
                                            {branch.name_of_shop}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </label>


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
                                        checked={schedule[key] && schedule[key].isActive}
                                        onChange={(e) => updateSchedule(key, 'isActive', e.target.checked)}
                                        className={styles.checkboxDay}
                                    />
                                </label>
                            </div>
                            <div className={styles.timeInputs}>
                                <input
                                    type="time"
                                    value={schedule[key] ? schedule[key].from : ''}
                                    disabled={!schedule[key] || !schedule[key].isActive}
                                    onChange={(e) => updateSchedule(key, 'from', e.target.value)}
                                    className={styles.timeInput}
                                />
                                <span>-</span>
                                <input
                                    type="time"
                                    value={schedule[key] ? schedule[key].to : ''}
                                    disabled={!schedule[key] || !schedule[key].isActive}
                                    onChange={(e) => updateSchedule(key, 'to', e.target.value)}
                                    className={styles.timeInput}
                                />
                            </div>
                        </div>
                    ))}

                    <div className={styles.buttons}>
                        <button className={styles.cancelButton} onClick={() => {
                            onClose();
                        }}>Отмена</button>
                        <button className={styles.saveButton} disabled={!isFormValid()} onClick={saveUpdatedEmployeeData}>Сохранить</button>
                    </div>
                </div>
            </div>
        )
    );
}

export default EditStaffModel;