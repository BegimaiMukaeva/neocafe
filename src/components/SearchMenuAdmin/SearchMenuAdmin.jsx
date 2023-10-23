import React from 'react';
import searchIcon from '../../img/searchAdminIcon.svg';
import searchIconAdmin from '../../img/searchAdmin.svg';
import styles from './SearchMenuAdmin.module.css';

const SearchMenuAdmin = () => {
    return (
        <div className={styles.main}>
            <div className={styles.searchMenu}>
                <h2>Меню</h2>
                <img src={searchIcon} alt=""/>
            </div>
            <div className={styles.searchMenuInput}>
                {/*<img src={searchIconAdmin} alt=""/>*/}
                <input type="text" placeholder='Поиск'/>
                <button>Создать</button>
            </div>
        </div>
    );
};

export default SearchMenuAdmin;