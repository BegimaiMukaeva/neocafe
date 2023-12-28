import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { editBranch } from '../../../store/branchesAdminSlice';
import styles from '../AddNewBranch/AddNewBranch.module.css';
import closeModal from "../../../img/X-black.svg";
import productImage from "../../../img/CloudArrowUp.png";

function EditBranchModal({ isVisible, onClose, branchId }) {
    const dispatch = useDispatch();
    const [positionName, setPositionName] = useState('');
    const [positionAddress, setPositionAddress] = useState('');
    const [positionPhone, setPositionPhone] = useState('');
    const [positionTwoGis, setPositionTwoGis] = useState('');
    const [positionCountTable, setPositionCountTable] = useState('');
    const [image, setImage] = useState(null);
    const [editedSchedule, setEditedSchedule] = useState({
        monday: { isActive: false, from: '08:00', to: '17:00' },
        tuesday: { isActive: false, from: '08:00', to: '17:00' },
        wednesday: { isActive: false, from: '08:00', to: '17:00' },
        thursday: { isActive: false, from: '08:00', to: '17:00' },
        friday: { isActive: false, from: '08:00', to: '17:00' },
        saturday: { isActive: false, from: '08:00', to: '17:00' },
        sunday: { isActive: false, from: '08:00', to: '17:00' },
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

    useEffect(() => {
        if (branchId) {
            fetchBranchData(branchId);
        }
    }, [branchId]);

    const fetchBranchData = async (id) => {
        try {
            const response = await axios.get(`https://muha-backender.org.kg/branches/${id}/`, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            const data = response.data;
            setPositionName(data.name_of_shop);
            setPositionAddress(data.address);
            setPositionPhone(parseFloat(data.phone_number));
            setPositionTwoGis(data.link_to_map);
            setPositionCountTable(data.counts_of_tables);
            setImage(data.image);

            console.log("Fetched Data:", data);

            const fetchedSchedule = buildScheduleFromData(data.workdays);
            console.log("Fetched Schedule:", fetchedSchedule);

            setEditedSchedule(fetchedSchedule);
        } catch (error) {
            console.error('Ошибка при получении данных филиала:', error);
        }
    };

    const buildScheduleFromData = (workdays) => {
        let newSchedule = { ...editedSchedule };
        workdays.forEach(day => {
            const dayKey = convertNumberToDayKey(day.workday);
            newSchedule[dayKey] = {
                isActive: true,
                from: day.start_time.slice(0, 5),
                to: day.end_time.slice(0, 5)
            };
        });
        return newSchedule;
    };

    const convertNumberToDayKey = (number) => {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        return days[number - 1];
    };

    const convertDayToNumber = (dayKey) => {
        const days = { monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 7 };
        return days[dayKey];
    };

    const formatPhoneNumber = (phoneNumber) => {
        return `+${phoneNumber}`;
    };

    const handleScheduleChange = (day, field, value) => {
        setEditedSchedule(prevSchedule => ({
            ...prevSchedule,
            [day]: {
                ...prevSchedule[day],
                [field]: value,
            }
        }));
    };


    useEffect(() => {
        console.log('editedSchedule', editedSchedule);
    }, [editedSchedule]);





    const saveBranchData = async () => {
        const updatedData = {
            name_of_shop: positionName,
            address: positionAddress,
            phone_number: formatPhoneNumber(positionPhone),
            link_to_map: positionTwoGis,
            counts_of_tables: positionCountTable,
        };
        dispatch(editBranch({ branchId, updatedData }))
            .then(() => {
                onClose();
            })
            .catch(error => {
                console.error('Ошибка при редактировании филиала:', error);
            });
    };


    const saveBranchSchedule = async () => {
        const scheduleData = {
            workdays: Object.entries(editedSchedule)
                .filter(([_, value]) => value.isActive)
                .map(([key, value]) => ({
                    workday: convertDayToNumber(key),
                    start_time: value.from,
                    end_time: value.to,
                })),
        };

        try {
            await axios.patch(`https://muha-backender.org.kg/branches/schedule/update/${branchId}/`, scheduleData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            onClose();
        } catch (error) {
            console.error('Ошибка при обновлении графика работы филиала:', error);
        }
    };

    const saveUpdatedBranchData = async () => {
        await saveBranchData();
        await saveBranchSchedule();
        await saveBranchImage();
    };



    const saveBranchImage = async () => {
        const formData = new FormData();
        formData.append('image', image);

        try {
            await axios.patch(`https://muha-backender.org.kg/branches/image/${branchId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });
            onClose();
        } catch (error) {
            console.error('Ошибка при обновлении изображения филиала:', error);
        }
    };

    return (
        isVisible && (
            <div className={styles.modalOverlay}>
                <div className={styles.modalContainer}>
                    <div className={styles.titleModal}>
                        <h2 className={styles.title}>Редактирование</h2>
                        <button className={styles.modalCloseButton} onClick={() => {
                            onClose();
                        }}>
                            <img src={closeModal} alt=""/>
                        </button>
                    </div>

                    <div className={styles.imageUpload}>
                        <label htmlFor="imageUpload" className={styles.imageLabel}>
                            Добавьте фотографию филиала
                        </label>
                        <div className={styles.imageBorder}>
                            <div className={styles.imagePreview}>
                                {!image ? (
                                    <img src={productImage} alt="Иконка загрузки" />
                                ) : (
                                    image instanceof File ? (
                                        <img src={URL.createObjectURL(image)} alt="Предварительный просмотр" />
                                    ) : (
                                        <img src={image} alt="Филиал" />
                                    )
                                )}
                                <p className={styles.imageText}>Перетащите изображение для изменения <br/> или <span className={styles.imageChangeText}>обзор</span></p>
                            </div>
                        </div>
                        <input
                            type="file"
                            id="imageUpload"
                            accept=".jpg, .jpeg, .png"
                            onChange={(e) => setImage(e.target.files[0])}
                            className={styles.imageInput}
                        />
                    </div>


                    <p className={styles.imageLabel}>Название и адрес</p>
                    <label className={styles.nameOfInput}>Название кофейни
                        <input
                            type="text"
                            placeholder="Название филиала"
                            value={positionName}
                            onChange={e => setPositionName(e.target.value)}
                            className={styles.textInput}
                        />
                    </label>

                    <label className={styles.nameOfInput}>Адрес
                        <input
                            type="text"
                            placeholder="Адрес нового филиала"
                            value={positionAddress}
                            onChange={e => setPositionAddress(e.target.value)}
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

                    <label className={styles.nameOfInput}>Ссылка на 2ГИС
                        <input
                            type="text"
                            placeholder="Вставьте ссылку на 2ГИС"
                            value={positionTwoGis}
                            onChange={e => setPositionTwoGis(e.target.value)}
                            className={styles.textInput}
                        />
                    </label>

                    <label className={styles.nameOfInput}>Количество столов
                        <input
                            type="number"
                            placeholder="Количество столов в данном филиале"
                            value={positionCountTable}
                            onChange={e => setPositionCountTable(e.target.value)}
                            className={styles.textInput}
                        />
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
                                        checked={editedSchedule[key]?.isActive || false}
                                        onChange={(e) => handleScheduleChange(key, 'isActive', e.target.checked)}
                                        className={styles.checkboxDay}
                                    />
                                </label>
                            </div>
                            <div className={styles.timeInputs}>
                                <input
                                    type="time"
                                    value={editedSchedule[key]?.from || ''}
                                    disabled={!editedSchedule[key]?.isActive}
                                    onChange={(e) => handleScheduleChange(key, 'from', e.target.value)}
                                    className={styles.timeInput}
                                />
                                <span>-</span>
                                <input
                                    type="time"
                                    value={editedSchedule[key]?.to || ''}
                                    disabled={!editedSchedule[key]?.isActive}
                                    onChange={(e) => handleScheduleChange(key, 'to', e.target.value)}
                                    className={styles.timeInput}
                                />
                            </div>
                        </div>
                    ))}
                    <div className={styles.buttons}>
                        <button className={styles.cancelButton} onClick={() => {
                            onClose();
                        }}>Отмена</button>
                        <button className={styles.saveButton} onClick={saveUpdatedBranchData}>Сохранить</button>
                    </div>
                </div>
            </div>
        )
    );
}

export default EditBranchModal;
