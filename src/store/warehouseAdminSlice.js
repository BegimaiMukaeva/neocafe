import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk(
    'warehouseAdmin/fetchProducts',
    async (_, { rejectWithValue }) => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('https://muha-backender.org.kg/admin-panel/ready-made-products/', {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);

export const fetchIngredients = createAsyncThunk(
    'warehouseIngredientAdmin/fetchIngredients',
    async (_, { rejectWithValue }) => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get('https://muha-backender.org.kg/admin-panel/ingredients/', {
          headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);


export const fetchIngredientsBySearch = createAsyncThunk(
    'branchesAdmin/fetchIngredientsBySearch',
    async (searchTerm, { dispatch }) => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`https://muha-backender.org.kg/admin-panel/ingredients/?name=${searchTerm}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        });
        return response.data;
      } catch (error) {
        console.error('Ошибка при поиске продуктов:', error);
      }
    }
);

export const fetchProductsBySearch = createAsyncThunk(
    'branchesAdmin/fetchProductsBySearch',
    async (searchTerm, { dispatch }) => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await axios.get(`https://muha-backender.org.kg/admin-panel/ready-made-products/?name=${searchTerm}`, {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        });
        return response.data;
      } catch (error) {
        console.error('Ошибка при поиске продуктов:', error);
      }
    }
);


export const addProduct = createAsyncThunk(
    'warehouseAdmin/addProduct',
    async (productData, { dispatch, rejectWithValue }) => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        };

        let url = '';
        let data = {};

        if (productData.category === "Готовая продукция") {
          url = 'https://muha-backender.org.kg/admin-panel/ready-made-products/create/';
          data = {
            name: productData.name,
            price: productData.price,
            description: productData.description,
            category: productData.selectedCategoryId,
            available_at_branches: productData.available_at_branches,
          };
        } else if (productData.category === "Сырье") {
          url = 'https://muha-backender.org.kg/admin-panel/ingredients/create/';
          data = {
            name: productData.name,
            measurement_unit: 'g',
            available_at_branches: productData.available_at_branches,
          };
        }

        const response = await axios.post(url, data, { headers });
        dispatch(fetchProducts());
        dispatch(fetchIngredients());
        console.log(response.data)
        return response.data.id;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
);

export const deleteItem = createAsyncThunk(
    'warehouseAdmin/deleteItem',
    async ({ itemId, category }, { dispatch }) => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const url = category === 'ingredient'
            ? `https://muha-backender.org.kg/admin-panel/ingredients/destroy/${itemId}/`
            : `https://muha-backender.org.kg/admin-panel/ready-made-products/destroy/${itemId}/`;
        await axios.delete(url, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        console.log(`${category} удален успешно:`, itemId);

        if (category === 'ingredient') {
          dispatch(fetchIngredients());
        } else {
          dispatch(fetchProducts());
        }
      } catch (error) {
        console.error(`Ошибка при удалении ${category}:`, error);
      }
    }
);

export const editItem = createAsyncThunk(
    'warehouseAdmin/editItem',
    async ({ itemId, category, updatedData }, { dispatch }) => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        };

        const url = category === 'ingredient'
            ? `https://muha-backender.org.kg/admin-panel/ingredients/update/${itemId}/`
            : `https://muha-backender.org.kg/admin-panel/ready-made-products/update/${itemId}/`;

        await axios.patch(url, updatedData, { headers });
        console.log(`${category} обновлен успешно:`, itemId);

        if (category === 'ingredient') {
          dispatch(fetchIngredients());
        } else {
          dispatch(fetchProducts());
        }
      } catch (error) {
        console.error(`Ошибка при редактировании ${category}:`, error);
      }
    }
);



const warehouseAdminSlice = createSlice({
  name: 'warehouseAdmin',
  initialState: {
    products: [],
    ingredients: [],
    loading: false,
    error: null,
  },
  extraReducers: {
    [fetchProducts.pending]: (state) => {
      state.loading = true;
    },
    [fetchProducts.fulfilled]: (state, action) => {
      state.products = action.payload;
      state.loading = false;
    },
    [fetchProducts.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [fetchIngredients.fulfilled]: (state, action) => {
      state.ingredients = action.payload;
    },
    [fetchIngredients.rejected]: (state, action) => {
      state.error = action.payload;
    },
     [fetchProductsBySearch.fulfilled]: (state, action) => {
      state.products = action.payload;
    },
     [fetchIngredientsBySearch.fulfilled]: (state, action) => {
      state.ingredients = action.payload;
    },
    [fetchIngredientsBySearch.rejected]: (state, action) => {
      state.error = action.payload;
    },
    [fetchProductsBySearch.rejected]: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { } = warehouseAdminSlice.actions;
export default warehouseAdminSlice.reducer;
