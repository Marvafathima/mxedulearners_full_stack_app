// src/store/userManagementSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAxiosInstance } from '../api/axios';

export const fetchTutorRequests = createAsyncThunk(
  'userManagement/fetchTutorRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAxiosInstance.get('/usermanagement/tutor-requests/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch tutor requests');
    }
  }
);

// editEducation,addEducation

export const approveTutor = createAsyncThunk(
  'userManagement/approveTutor',
  async (userId, { rejectWithValue }) => {
    try {
      await adminAxiosInstance.post(`/usermanagement/approve-tutor/${userId}/`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to approve tutor');
    }
  }
);

export const rejectTutor = createAsyncThunk(
  'userManagement/rejectTutor',
  async (userId, { rejectWithValue }) => {
    try {
      await adminAxiosInstance.post(`/usermanagement/reject-tutor/${userId}/`);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to reject tutor');
    }
  }
);

export const fetchTutorDetail = createAsyncThunk(
  'userManagement/fetchTutorDetail',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminAxiosInstance.get(`/usermanagement/tutor-detail/${userId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch tutor details');
    }
  }
);

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState: {
    tutorRequests: [],
    selectedTutor: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTutorRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTutorRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.tutorRequests = action.payload;
      })
      .addCase(fetchTutorRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(approveTutor.fulfilled, (state, action) => {
        state.tutorRequests = state.tutorRequests.filter(tutor => tutor.id !== action.payload);
      })
      .addCase(rejectTutor.fulfilled, (state, action) => {
        state.tutorRequests = state.tutorRequests.filter(tutor => tutor.id !== action.payload);
      })
      .addCase(fetchTutorDetail.fulfilled, (state, action) => {
        state.selectedTutor = action.payload;
      })
      .addCase(fetchTutorDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTutorDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export default userManagementSlice.reducer;