import React, { useState } from 'react';
import styles from './ProductsNavigateWarehouse.module.css';
import WarehouseTableAdmin from '../WarehouseTableAdmin/WarehouseTableAdmin'
import CompositionTableSecond from "../CompositionTableSecond/CompositionTableSecond";
import WarehouseBalanceTable from "../WarehouseBalanceTable/WarehouseBalanceTable";
import FinishedProductTable from '../FinishedProductTable/FinishedProductTable';

const ProductsNavigateWarehouse = () => {
    const [activeTable, setActiveTable] = useState('finishedProducts');

    const handleTableChange = (table) => {
        setActiveTable(table);
    };

    const getButtonClass = (tableName) => {
        let buttonClass = styles.navigateProductButton;

        if (activeTable === tableName) {
            buttonClass += ` ${styles.navigateProductActiveButton}`;
        }

        if (tableName === 'endingProducts') {
            buttonClass += ` ${styles.navigateProductLastButton}`;
        }

        if (activeTable === tableName && tableName === 'endingProducts') {
            buttonClass += ` ${styles.navigateProductLastButtonActive}`;
        }

        return buttonClass;
    };


    return (
        <div>
            <div className={styles.main}>
                <button
                    className={getButtonClass('finishedProducts')}
                    onClick={() => handleTableChange('finishedProducts')}
                >
                    Готовая продукция
                </button>
                <button
                    className={getButtonClass('rawMaterials')}
                    onClick={() => handleTableChange('rawMaterials')}
                >
                    Сырье
                </button>
                <button
                    className={getButtonClass('warehouseRemnants')}
                    onClick={() => handleTableChange('warehouseRemnants')}
                >
                    Остатки по складам
                </button>
                <button
                    className={getButtonClass('endingProducts')}
                    onClick={() => handleTableChange('endingProducts')}
                >
                    Заканчивающиеся продукты
                </button>
            </div>
            <div>
                {activeTable === 'finishedProducts' && <FinishedProductsTable />}
                {activeTable === 'rawMaterials' && <RawMaterialsTable />}
                {activeTable === 'warehouseRemnants' && <WarehouseRemnantsTable />}
                {activeTable === 'endingProducts' && <EndingProductsTable />}
            </div>
        </div>
    );
};


const FinishedProductsTable = () => <div>
    <WarehouseTableAdmin />
</div>;
const RawMaterialsTable = () => <div>
    <CompositionTableSecond />
</div>;
const WarehouseRemnantsTable = () => <div>
    <WarehouseBalanceTable />
</div>;
const EndingProductsTable = () => <div>
    <FinishedProductTable />
</div>;

export default ProductsNavigateWarehouse;
