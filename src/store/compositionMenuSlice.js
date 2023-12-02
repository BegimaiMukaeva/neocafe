import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from "axios";


export const addNewCompositionMenu = createAsyncThunk(
    'compositionMenu/addNewCompositionMenu',
    async (data, {dispatch}) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.post('https://muha-backender.org.kg/admin-panel/items/create/', JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            console.log('addNewCompositionMenu Response:', response.data); // Логирование ответа
            if (response.data) {
                dispatch(fetchProducts());
            }
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании позиции:', error.response.data);
            return null;
        }
    }
);



export const fetchProducts = createAsyncThunk(
    'compositionMenu/fetchProducts',
    async (_, {dispatch}) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get('https://muha-backender.org.kg/admin-panel/items/', {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            dispatch(setProducts(response.data));
        } catch (error) {
            console.error('Ошибка при получении продуктов:', error);
        }
    }
);



const compositionMenuSlice = createSlice({
    name: 'compositionMenu',
    initialState: [],
    reducers: {
        addCompositionMenu: (state, action) => {
            const newItem = action.payload;
            console.log('Текущее состояние (до добавления):', state);
            console.log('Новый элемент:', newItem);
            if (newItem && !state.find(item => item.id === newItem.id)) {
                return [...state, newItem];
            }
            console.log('Состояние после добавления:', state);
            return state;
        },
        setProducts: (state, action) => {
            return action.payload;
        },
    }
});

export const { setProducts, addCompositionMenu } = compositionMenuSlice.actions;
export default compositionMenuSlice.reducer;


;