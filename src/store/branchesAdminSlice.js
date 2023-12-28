import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBranches = createAsyncThunk(
    'branchesAdmin/fetchBranches',
    async (_, {dispatch}) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get('https://muha-backender.org.kg/branches/', {
                 headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            dispatch(setBranches(response.data));
        } catch (error) {
            console.error('Ошибка при получении продуктов:', error);
        }
    }
);
//
// export const addNewBranch = createAsyncThunk(
//     'branchesAdmin/addNewBranch',
//     async (branchData, { rejectWithValue, dispatch }) => {
//         try {
//             const accessToken = localStorage.getItem('accessToken');
//             const response = await axios.post('https://muha-backender.org.kg/branches/create/', branchData, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${accessToken}`,
//                 },
//             });
//
//             dispatch(fetchBranches());
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response.data);
//         }
//     }
// );

export const addNewBranch = createAsyncThunk(
    'branchesAdmin/addNewBranch',
    async (branchData, { rejectWithValue, dispatch }) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.post('https://muha-backender.org.kg/branches/create/', branchData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const branchId = response.data.id;
            if (branchData.image) {
                await uploadBranchImage(branchId, branchData.image, dispatch);
            }

            dispatch(fetchBranches());
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const uploadBranchImage = async (branchId, image, dispatch) => {
    const formData = new FormData();
    formData.append('image', image);

    try {
        const accessToken = localStorage.getItem('accessToken');
        await axios.put(`https://muha-backender.org.kg/branches/image/${branchId}/`, formData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });
        // Обновить данные о филиалах
        dispatch(fetchBranches());
    } catch (error) {
        console.error('Ошибка при загрузке изображения филиала:', error);
    }
};





export const fetchBranchesBySearch = createAsyncThunk(
    'branchesAdmin/fetchBranchesBySearch',
    async (searchTerm, { dispatch }) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`https://muha-backender.org.kg/branches/?name=${searchTerm}`, {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            dispatch(setBranches(response.data))
            return response.data;
        } catch (error) {
            console.error('Ошибка при поиске продуктов:', error);
        }
    }
);


export const deleteBranch = createAsyncThunk(
    'branchesAdmin/deleteBranch',
    async (branchId, { dispatch, rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.delete(`https://muha-backender.org.kg/branches/delete/${branchId}/`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            dispatch(fetchBranches());
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const editBranch = createAsyncThunk(
    'branchesAdmin/editBranch',
    async ({ branchId, updatedData }, { dispatch, rejectWithValue }) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.patch(`https://muha-backender.org.kg/branches/update/${branchId}/`, updatedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const updatedBranchData = { id: branchId, ...updatedData };
            dispatch(fetchBranches());
            return updatedBranchData;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const branchesAdminSlice = createSlice({
    name: 'branchesAdmin',
    initialState: [],
    reducers: {
        addBranchAdmin: (state, action) => {
            const newItem = action.payload;
            if (newItem && !state.find(item => item.id === newItem.id)) {
                return [...state, newItem];
            }
            console.log('Состояние после добавления:', state);
            return state;
        },
        setBranches: (state, action) => {
            return action.payload;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        extraReducers: {
            [fetchBranchesBySearch.fulfilled]: (state, action) => {
                state.searchResults = action.payload;
            },
        }
    }
});

export const { setBranches } = branchesAdminSlice.actions;
export default branchesAdminSlice.reducer;

