import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAxiosInstance as axios}  from '../../src/api/axios'
import { fetchTutorDetail } from './userManagementSlice';

export const fetchApprovedTutors = createAsyncThunk(
  'tutors/fetchApproved',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/admintutor/approved-tutors/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const adminfetchTutorDetail = createAsyncThunk(
  'tutors/fetchOne',
  async (tutorId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/admintutor/current_tutor/${tutorId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const adminfetchCourseList = createAsyncThunk(
  'admin/course/list',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/admintutor/courses/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const tutorSlice = createSlice({
  name: 'tutors',
  initialState: {
    tutors: [],
    currentTutor:[],
    courseList:[],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApprovedTutors.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApprovedTutors.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tutors = action.payload;
      })
      .addCase(fetchApprovedTutors.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(adminfetchTutorDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(adminfetchTutorDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentTutor = action.payload;
      })
      .addCase(adminfetchTutorDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(adminfetchCourseList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(adminfetchCourseList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courseList = action.payload;
      })
      .addCase(adminfetchCourseList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      
      ;
  },
});

export default tutorSlice.reducer;