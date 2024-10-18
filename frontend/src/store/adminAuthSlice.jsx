
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAxiosInstance } from '../api/axios';

export const loginAdmin = createAsyncThunk(
  'adminAuth/login',
  
  async ({ email, password }, { rejectWithValue }) => {
    console.log(email,password,"before the try to check is passed")
    try {
      console.log(email,password)

      const response = await adminAxiosInstance.post('/login', { email, password });
      if (response.data.isAdmin) {
        localStorage.setItem('adminToken', response.data.access);
        console.log(response.data.access,response.data.refresh,response.data.user)
        localStorage.setItem('adminRefreshToken', response.data.refresh);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        return response.data;
      } else {
        return rejectWithValue('Not an admin user');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Login failed');
    }
  }
);

export const refreshAdminToken = createAsyncThunk(
  'adminAuth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('adminRefreshToken');
      const response = await adminAxiosInstance.post('/token/refresh', { refresh: refreshToken });
      localStorage.setItem('adminToken', response.data.access);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Token refresh failed');
    }
  }
);
export const logoutAdmin = createAsyncThunk(
  'adminAuth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('adminRefreshToken');
      await adminAxiosInstance.post('/logout/', { refresh_token: refreshToken });
      localStorage.removeItem(`adminRefreshToken`);
      localStorage.removeItem(`adminToken`);
      localStorage.removeItem(`adminUser`);
     
      return;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Logout failed');
    }
  }
);
export const fetchAdminMe = createAsyncThunk(
  'adminAuth/fetchAdminMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAxiosInstance.get('/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch admin data');
    }
  }
);

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    admin: JSON.parse(localStorage.getItem('adminUser')) || null,
    isAuthenticated: !!(localStorage.getItem('adminToken')&& localStorage.getItem('adminUser')),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      localStorage.removeItem('adminUser');
      state.admin = null;
      state.isAuthenticated = false;
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('adminUser', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload.user;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(refreshAdminToken.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(refreshAdminToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.admin = null;
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        localStorage.removeItem('adminUser');
      })
      .addCase(fetchAdminMe.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.isAuthenticated = true;
        localStorage.setItem('adminUser', JSON.stringify(action.payload));
      })
      .addCase(fetchAdminMe.rejected, (state) => {
        state.isAuthenticated = false;
        state.admin = null;
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        localStorage.removeItem('adminUser');
      })
      
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
        state.isAuthenticated = false;
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRefreshToken');
        localStorage.removeItem('adminUser');
      });
  },
});

export const { logout, setAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;