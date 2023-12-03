import { configureStore } from "@reduxjs/toolkit";
import compositionMenuReducer from './compositionMenuSlice';
import staffAdminReducer from './staffAdminSlice';
import branchesAdminReducer from './branchesAdminSlice';
import warehouseAdminReducer from './warehouseAdminSlice';
import warehouseIngredientAdminReducer from './warehouseAdminSlice';

export default configureStore({
    reducer: {
        compositionMenu: compositionMenuReducer,
        staffAdmin: staffAdminReducer,
        branchesAdmin: branchesAdminReducer,
        warehouseAdmin: warehouseAdminReducer,
        warehouseIngredientAdmin: warehouseIngredientAdminReducer,
    }
});
