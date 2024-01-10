import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from "axios";


export const addNewCompositionMenu = createAsyncThunk(
    'compositionMenu/addNewCompositionMenu',
    async (data, {rejectWithValue}) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.post('https://muha-backender.org.kg/admin-panel/items/create/', JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            console.log('addNewCompositionMenu Response:', response.data);
            return response.data.id;
        } catch (error) {
            return rejectWithValue(error.response.data);
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


export const fetchProductsBySearch = createAsyncThunk(
    'compositionMenu/fetchProductsBySearch',
    async (searchTerm, { dispatch }) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`https://muha-backender.org.kg/admin-panel/items/?name=${searchTerm}`, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            dispatch(setProducts(response.data))
            return response.data;
        } catch (error) {
            console.error('Ошибка при поиске продуктов:', error);
        }
    }
);


//
// const compositionMenuSlice = createSlice({
//     name: 'compositionMenu',
//     initialState,
//     reducers: {
//         addCompositionMenu: (state, action) => {
//             const newItem = action.payload;
//             console.log('Текущее состояние (до добавления):', state);
//             console.log('Новый элемент:', newItem);
//             if (newItem && !state.find(item => item.id === newItem.id)) {
//                 return [...state, newItem];
//             }
//             console.log('Состояние после добавления:', state);
//             return state;
//         },
//         setProducts: (state, action) => {
//             return action.payload;
//         },
//         setSearchTerm: (state, action) => {
//         state.searchTerm = action.payload;
//     },
//     }
// });

const compositionMenuSlice = createSlice({
    name: 'compositionMenu',
    initialState:[],
    // initialState,
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
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        extraReducers: {
            [fetchProductsBySearch.fulfilled]: (state, action) => {
                state.searchResults = action.payload;
            },
        }
    }
});

export const { setProducts, addCompositionMenu, setSearchTerm } = compositionMenuSlice.actions;
export default compositionMenuSlice.reducer;


