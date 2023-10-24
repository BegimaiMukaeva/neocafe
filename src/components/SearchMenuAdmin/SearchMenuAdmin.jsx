import React from 'react';
import searchIcon from '../../img/searchAdminIcon.svg';
import searchIconAdmin from '../../img/searchAdmin.svg';
import styles from './SearchMenuAdmin.module.css';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';

const SearchMenuAdmin = () => {
    return (
        <div className={styles.main}>
            <div className={styles.searchMenu}>
                <h2>Меню</h2>
                <img className={styles.searchIcon} src={searchIcon} alt=""/>
            </div>
            <div className={styles.searchMenuInput}>
                <Input className={styles.searchInput} prefix={<SearchOutlined/>} placeholder='Поиск' />
                <button>Создать</button>
            </div>
        </div>
    );
};

export default SearchMenuAdmin;