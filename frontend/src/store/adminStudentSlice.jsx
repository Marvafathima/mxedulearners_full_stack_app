// studentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAxiosInstance as axios } from '../../src/api/axios';

export const fetchAllStudents = createAsyncThunk(
  'students/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/adminstudent/all_students/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const adminfetchStudentDetail = createAsyncThunk(
  'students/fetchOne',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/adminstudent/current_student/${studentId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleStudentActive = createAsyncThunk(
  'students/toggleActive',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/adminstudent/student/${id}/toggle-active/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const studentSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
    status: 'idle',
    currentStudent:[],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllStudents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = action.payload;
      })
      .addCase(fetchAllStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(toggleStudentActive.fulfilled, (state, action) => {
        const index = state.students.findIndex(student => student.id === action.payload.id);
        if (index !== -1) {
          state.students[index].is_active = action.payload.is_active;
        }
      })
      .addCase(adminfetchStudentDetail.fulfilled, (state, action) => {
        state.status="succeeded";
        state.currentStudent=action.payload 
      })
      .addCase(adminfetchStudentDetail.pending, (state, action) => {
        state.status="loading";
      
      })
      .addCase(adminfetchStudentDetail.rejected, (state, action) => {
        state.status="failed";
        state.error=action.payload;
      
      })
      ;
  },
});

export default studentSlice.reducer;