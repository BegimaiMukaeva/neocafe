import React, { useState, useEffect } from 'react';
import closeModal from '../../../img/X.svg';
import styles from './NotificationsAdminPage.module.css';
import circleNotifications from '../../../img/Circle.svg';
import closeModalBlack from '../../../img/X-white.svg';
import axios from 'axios';

const NotificationsAdminPage = ({ isVisible, onClose }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const socket = new WebSocket('wss://muha-backender.org.kg/ws/notifications/admin/');
        socket.onopen = () => {
            console.log("Connected to WebSocket for Admin Notifications");
        };

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.notifications && data.notifications.length > 0) {
                setNotifications(data.notifications);
                console.log(data.notifications)
            }
        };


        socket.onclose = () => {
            console.error('WebSocket closed unexpectedly');
        };

        socket.onerror = (e) => {
            console.error('WebSocket encountered an error: ', e.message, 'Closing socket');
            socket.close();
        };

        return () => socket.close();
    }, []);

    const deleteNotification = async (id) => {
        try {
            await axios.get(`https://muha-backender.org.kg/notices/delete-admin-notification/?id=${id}`);
            setNotifications(notifications.filter(notification => notification.id !== id));
        } catch (error) {
            console.error('Ошибка при удалении уведомления:', error);
        }
    };


    const clearAllNotifications = async () => {
        try {
            await axios.get('https://muha-backender.org.kg/notices/clear-admin-notifications/');
            setNotifications([]);
        } catch (error) {
            console.error('Ошибка при удалении всех уведомлений:', error);
        }
    };

    return (
        <div className={styles.modal} style={{ display: isVisible ? 'block' : 'none' }}>
            <div className={styles.modalTitle}>
                <h4>Уведомления</h4>
                <button className={styles.modalCloseButton} onClick={onClose}>
                    <img src={closeModal} alt="Close"/>
                </button>
            </div>
            <button className={styles.modalClearNotifications} onClick={clearAllNotifications}>Очистить все</button>
            <div className={styles.modalContent}>
                {notifications.length === 0 ? (
                    <div className={styles.noNotifications}>Новых уведомлений нет</div>
                ) : (
                    notifications.map(notification => (
                        <div className={styles.modalNotificationsMessage} key={notification.id}>
                            <div className={styles.modalNotificationsTime}>
                                <div>
                                    <span>{notification.date_of_notification}</span>
                                </div>
                                <div>
                                    <button
                                        className={styles.modalCloseButton}
                                        onClick={() => deleteNotification(notification.id)}
                                    >
                                        <img src={closeModalBlack} alt=""/>
                                    </button>
                                </div>
                            </div>
                            <div className={styles.modalNotificationsValue}>
                                <span className={styles.notificationsProductNone}>{notification.text}</span>
                            </div>
                            <div className={styles.modalNotificationsValue}>
                                <span>Филиал:</span>
                                <span className={styles.notificationsProductNone}>{notification.branch}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsAdminPage;
