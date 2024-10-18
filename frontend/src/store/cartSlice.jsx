// src/redux/slices/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userInstance } from '../api/axios';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await userInstance.get('/cartmanagement/cart/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (courseId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await userInstance.post('/cartmanagement/cart/', { course_id: courseId }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId, { getState, rejectWithValue }) => {
    try {
      console.log(cartItemId,"sending this cart item to remove in backend")
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token available');
      }

      await userInstance.delete('/cartmanagement/cart/', {
        // data: { course_id: courseId },
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        data: { cart_item_id: cartItemId },
      });
      
      return cartItemId;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token available');
      }

      await userInstance.delete('/cartmanagement/clear-cart/', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      return;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    count:JSON.parse(localStorage.getItem('cartCount')),
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.count = action.payload.items.length;
        localStorage.setItem('cartCount', JSON.stringify(state.count));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.count = action.payload.items.length;
        state.status = 'succeeded';
        localStorage.setItem('cartCount', JSON.stringify(state.count));
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.course.id !== action.payload);
        console.log(state.count,"this is the count")
        state.count = state.items.length;
        localStorage.setItem('cartCount', JSON.stringify(state.count));
      })
      .addCase(clearCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.count = 0;
        state.status = 'succeeded';
        localStorage.setItem('cartCount', '0');
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;