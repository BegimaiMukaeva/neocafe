import React, { useState } from 'react';
import styles from '../AddNewBranch/AddNewBranch.module.css';
import closeModal from "../../../img/X-black.svg";
import productImage from "../../../img/CloudArrowUp.png";

const staticData = {
  "businessInfo": {
    "name": "NeoCafe Dezerzhinka",
    "address": "бульвар Эржанкина, 35",
    "phone": "996555231234",
    "zgisLink": "https://zgis.kg/bishkek/geo/7030076198570292"
  },
  "workSchedule": {
    "monday": {
      "isActive": true,
      "from": "11:00",
      "to": "22:00"
    },
    "tuesday": {
      "isActive": true,
      "from": "11:00",
      "to": "22:00"
    },
    "wednesday": {
      "isActive": true,
      "from": "11:00",
      "to": "22:00"
    },
    "thursday": {
      "isActive": true,
      "from": "11:00",
      "to": "22:00"
    },
    "friday": {
      "isActive": true,
      "from": "11:00",
      "to": "22:00"
    },
    "saturday": {
      "isActive": false,
      "from": "08:00",
      "to": "17:00"
    },
    "sunday": {
      "isActive": false,
      "from": "08:00",
      "to": "17:00"
    }
  }
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


function EditBranchModal({ isVisible , onClose }) {
    const [positionName, setPositionName] = useState(staticData.businessInfo.name);
    const [positionAddress, setPositionAddress] = useState(staticData.businessInfo.address);
    const [positionPhone, setPositionPhone] = useState(staticData.businessInfo.phone);
    const [positionTwoGis, setPositionTwoGis] = useState(staticData.businessInfo.zgisLink);
    const [image, setImage] = useState(null);

    const [schedule, setSchedule] = useState(staticData.workSchedule);

    const updateSchedule = (day, field, value) => {
        setSchedule(prevSchedule => ({
            ...prevSchedule,
            [day]: {
                ...prevSchedule[day],
                [field]: value
            }
        }));
    };

    const resetFields = () => {
        setPositionName(staticData.businessInfo.name);
        setPositionAddress(staticData.businessInfo.address);
        setPositionPhone(staticData.businessInfo.phone);
        setPositionTwoGis(staticData.businessInfo.zgisLink);
        setSchedule(staticData.workSchedule);
        setImage(null);
    };

    return (
        isVisible && (
          <div className={styles.modalOverlay}>
              <div className={styles.modalContainer}>
                  <div className={styles.titleModal}>
                      <h2 className={styles.title}>Редактирование</h2>
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
                      <button className={styles.saveButton} >Создать</button>
                  </div>
              </div>
          </div>
        )
    );
}

export default EditBranchModal;
