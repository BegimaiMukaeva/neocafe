import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchBranches = createAsyncThunk(
    'branchesAdmin/fetchBranches',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get('https://muha-backender.org.kg/branches/', {
          headers: { 'accept': 'application/json' },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);

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

        dispatch(fetchBranches());
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
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
  initialState: {
    branches: [],
    loading: false,
    error: null,
  },
  extraReducers: {
    [fetchBranches.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [fetchBranches.fulfilled]: (state, action) => {
      state.branches = action.payload;
      state.loading = false;
    },
    [fetchBranches.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
     [editBranch.fulfilled]: (state, action) => {
    const index = state.branches.findIndex(branch => branch.id === action.payload.id);
    if (index !== -1) {
      state.branches[index] = action.payload;
    }
  },
  },
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
        },  }
});

export const { setBranches } = branchesAdminSlice.actions;
export default branchesAdminSlice.reducer;
