import React, { useState } from 'react';
import circleNotifications from '../../../img/Circle.svg';
import closeModal from '../../../img/X.svg';
import closeModalBlack from '../../../img/X-white.svg';
import styles from './NotificationsAdminPage.module.css';

const NotificationsAdminPage = ({ isVisible, onClose }) => {

  return (
    <div className={styles.modal} style={{ display: isVisible ? 'block' : 'none' }}>
        <div className={styles.modalTitle}>
            <h4>Уведомления</h4>
            <button className={styles.modalCloseButton} onClick={onClose}>
                <img src={closeModal} alt=""/>
            </button>
        </div>
        <button className={styles.modalClearNotifications}>Очистить все</button>
        <div className={styles.modalNotificationsMessage}>
            <div className={styles.modalNotificationsTime}>
                <div>
                    <span>25.10</span>
                    <img src={circleNotifications} alt=""/>
                    <span>14:09</span>
                </div>
                <div>
                    <button className={styles.modalCloseButton}>
                        <img src={closeModalBlack} alt=""/>
                    </button>
                </div>
            </div>
            <div className={styles.modalNotificationsValue}>
                <span>Заканчивается продукт:</span>
                <span className={styles.notificationsProductNone}>Молоко</span>
            </div>
            <div className={styles.modalNotificationsValue}>
                <span>Филиал:</span>
                <span className={styles.notificationsProductNone}>NeoCafe Dzerzhinka</span>
            </div>
        </div>
        <div className={styles.modalNotificationsMessage}>
            <div className={styles.modalNotificationsTime}>
                <div>
                    <span>25.10</span>
                    <img src={circleNotifications} alt=""/>
                    <span>14:09</span>
                </div>
                <div>
                    <button className={styles.modalCloseButton}>
                        <img src={closeModalBlack} alt=""/>
                    </button>
                </div>
            </div>
            <div className={styles.modalNotificationsValue}>
                <span>Заканчивается продукт:</span>
                <span className={styles.notificationsProductNone}>Молоко</span>
            </div>
            <div className={styles.modalNotificationsValue}>
                <span>Филиал:</span>
                <span className={styles.notificationsProductNone}>NeoCafe Dzerzhinka</span>
            </div>
        </div>
    </div>
  );
};

export default NotificationsAdminPage;

