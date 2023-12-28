import React, { useState } from 'react';
import {useDispatch} from "react-redux";
import axios from "axios";
import styles from './AddNewBranch.module.css';
import closeModal from "../../../img/X-black.svg";
import productImage from "../../../img/CloudArrowUp.png";
import {addNewBranch, fetchBranches} from '../../../store/branchesAdminSlice';

function AddNewBranch({ isVisible , onClose }) {
    const dispatch = useDispatch();
    const [positionName, setPositionName] = useState("");
    const [image, setImage] = useState(null);
    const [positionAddress, setPositionAddress] = useState("");
    const [positionPhone, setPositionPhone] = useState("");
    const [positionTwoGis, setPositionTwoGis] = useState("");
    const [positionCountTable, setPositionCountTable] = useState("");
    const [errorMessages, setErrorMessages] = useState([]);
    const [schedule, setSchedule] = useState({
        monday: { isActive: false, from: "11:00", to: "22:00" },
        tuesday: { isActive: false, from: "11:00", to: "22:00" },
        wednesday: { isActive: false, from: "11:00", to: "22:00" },
        thursday: { isActive: false, from: "11:00", to: "22:00" },
        friday: { isActive: false, from: "11:00", to: "22:00" },
        saturday: { isActive: false, from: "08:00", to: "17:00" },
        sunday: { isActive: false, from: "08:00", to: "17:00" },
    });
    const daysOfWeek = [
        { key: 'monday', name: 'Понедельник', number: 0 },
        { key: 'tuesday', name: 'Вторник', number: 1 },
        { key: 'wednesday', name: 'Среда', number: 2 },
        { key: 'thursday', name: 'Четверг', number: 3 },
        { key: 'friday', name: 'Пятница ', number: 4 },
        { key: 'saturday', name: 'Суббота', number: 5 },
        { key: 'sunday', name: 'Воскресенье', number: 6 },
    ];

    const isFormValid = () => {
        if (!positionName || !positionAddress || !positionPhone || !positionTwoGis || !positionCountTable) {
            return false;
        }
        return true;
    };
    const resetFields = () => {
        setPositionName("");
        setPositionAddress("");
        setPositionPhone("");
        setPositionTwoGis("");
        setPositionCountTable("");
        setImage(null);
        setErrorMessages([]);
        setPositionTwoGis("");
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

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const uploadBranchImage = async (branchId) => {
        const formData = new FormData();
        formData.append('image', image);

        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.put(`https://muha-backender.org.kg/branches/image/${branchId}/`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            // Обновление Redux после успешной загрузки изображения
            await dispatch(fetchBranches());

            console.log('Изображение филиала успешно загружено');
            resetFields();
            onClose();
        } catch (error) {
            console.error('Ошибка при загрузке изображения филиала:', error);
        }
    };


    const handleSubmit = async () => {
        const branchData = {
            name_of_shop: positionName,
            address: positionAddress,
            phone_number: positionPhone,
            link_to_map: positionTwoGis,
            counts_of_tables: positionCountTable,
            workdays: daysOfWeek.map(({ key, number }) => ({
                workday: schedule[key].isActive ? number + 1 :   null,
                start_time: schedule[key].isActive ? schedule[key].from : null,
                end_time: schedule[key].isActive ? schedule[key].to : null
            })).filter(day => day.workday !== null)
        };

        try {
            const result = await dispatch(addNewBranch(branchData)).unwrap();
            const branchId = result.id;

            if (branchId ) {
                await uploadBranchImage(branchId);
            }

        } catch (error) {
            setErrorMessages([error.message || "Ошибка при создании филиала"]);
        }
    };





    return (
        isVisible && (
            <div className={styles.modalOverlay}>
                <div className={styles.modalContainer}>
                    <div className={styles.titleModal}>
                        <h2 className={styles.title}>Новый филиал</h2>
                        <button className={styles.modalCloseButton} onClick={() => {
                            resetFields();
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
                                    <img src={URL.createObjectURL(image)} alt="Предварительный просмотр" />
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
                            type="text"
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
                    {errorMessages.length > 0 && (
                        <div className={styles.errorMessages}>
                            {errorMessages.map((msg, index) => <p key={index}>{msg}</p>)}
                        </div>
                    )}
                    <div className={styles.buttons}>
                        <button className={styles.cancelButton} onClick={() => {
                            resetFields();
                            onClose();
                        }}>Отмена</button>
                        <button className={styles.saveButton} onClick={handleSubmit} disabled={!isFormValid()}>Создать</button>
                    </div>
                </div>
            </div>
        )
    );
}

export default AddNewBranch;
