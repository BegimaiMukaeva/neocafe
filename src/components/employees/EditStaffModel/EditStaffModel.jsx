import React, { useState } from 'react';
import styles from '../../branches/AddNewBranch/AddNewBranch.module.css';
import closeModal from "../../../img/X-black.svg";

const staticData = {
  login: 'Alexandro-barman',
  password: '123456789',
  positionName: 'Александро',
  positionJob: 'Бармен',
  positionDate: '1997-05-31',
  positionPhone: '996555231234',
  positionBranch: 'NeoCafe Filarmonia',
  schedule: {
    monday: { isActive: true, from: '11:00', to: '22:00' },
    tuesday: { isActive: true, from: '11:00', to: '22:00' },
    wednesday: { isActive: true, from: '11:00', to: '22:00' },
    thursday: { isActive: true, from: '11:00', to: '22:00' },
    friday: { isActive: true, from: '11:00', to: '22:00' },
    saturday: { isActive: true, from: '08:00', to: '17:00' },
    sunday: { isActive: true, from: '08:00', to: '17:00' },
  }
};


function EditStaffModel({ isVisible , onClose }) {
    const [login, setLogin] = useState(staticData.login);
    const [password, setPassword] = useState(staticData.password);
    const [positionName, setPositionName] = useState(staticData.positionName);
    const [positionJob, setPositionJob] = useState(staticData.positionJob);
    const [positionDate, setPositionDate] = useState(staticData.positionDate);
    const [positionPhone, setPositionPhone] = useState(staticData.positionPhone);
    const [positionBranch, setPositionBranch] = useState(staticData.positionBranch);
    const [schedule, setSchedule] = useState(staticData.schedule);

    const daysOfWeek = [
      { key: 'monday', name: 'Понедельник' },
      { key: 'tuesday', name: 'Вторник' },
      { key: 'wednesday', name: 'Среда' },
      { key: 'thursday', name: 'Четверг' },
      { key: 'friday', name: 'Пятница' },
      { key: 'saturday', name: 'Суббота' },
      { key: 'sunday', name: 'Воскресенье' },
    ];

   const isFormValid = () => {
        if ( !login || !password || !positionName || !positionJob || !positionDate || !positionPhone || !positionBranch ) {
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

                  <label className={styles.nameOfInput} htmlFor="">Филиал
                          <select
                              value={positionBranch}
                              onChange={e => setPositionBranch(e.target.value)}
                              className={styles.textInput}
                          >
                              <option value="">Выберите филиал</option>
                              <option value="NeoCafe Ala-Too Square">NeoCafe Ala-Too Square</option>
                              <option value="NeoCafe Filarmonia">NeoCafe Filarmonia</option>
                              <option value="NeoCafe Filarmonia">NeoCafe Filarmonia</option>
                          </select>
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
                      <button className={styles.saveButton} disabled={!isFormValid()}>Сохранить</button>
                  </div>
              </div>
          </div>
        )
    );
}

export default EditStaffModel;
