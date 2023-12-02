import {configureStore} from "@reduxjs/toolkit";
import compositionMenuReducer from './compositionMenuSlice';

export default configureStore({reducer:{
    compositionMenu: compositionMenuReducer
}});