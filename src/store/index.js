import { configureStore } from "@reduxjs/toolkit";
import compositionMenuReducer from './compositionMenuSlice';
import staffAdminReducer from './staffAdminSlice'; // Импортируйте staffAdminReducer

export default configureStore({
    reducer: {
        compositionMenu: compositionMenuReducer,
        staffAdmin: staffAdminReducer // Добавьте staffAdminReducer
    }
});
