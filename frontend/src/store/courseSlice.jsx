


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userInstance } from '../api/axios';
import { getCurrentUserTokens, BASE_URL } from '../utils/auth';



export const addCourse = createAsyncThunk(
  'courses/addCourse',
  async (courseData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token available');
      }

      console.log("Access Token:", accessToken);

      const response = await userInstance.post(`/coursemanagement/courses/`, courseData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error details:", error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (courseId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token available');
      }

      console.log("Access Token:", accessToken);

      const response = await userInstance.delete(`/coursemanagement/courses/delete/${courseId}/` ,{
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return response.data.id;
    } catch (error) {
      console.error("Error details:", error.response ? error.response.data : error.message);
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);


export const fetchAllCourses = createAsyncThunk(
  'courses/fetchAllCourses',
  async ({ page = 1, limit = 2 }, { rejectWithValue }) => {
    try {
      const response = await userInstance.get(`/coursemanagement/courses_fetchall/?page=${page}&limit=${limit}`);
     console.log("fetched dataas:",response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);
export const fetchPurchasedCourses=createAsyncThunk(
  'courses.fetchPurchasedCourses',
  async (_,{rejectWithValue})=>{
    try {
      console.log("trying to send data to backend")
      const response=await userInstance.get('/coursemanagement/courses_fetch_purchased/');
      console.log("fetched courses",response.data)
      return response.data;
    }catch (error){
      return rejectWithValue(error.response? error.response.data: {message:error.message});
    }
  }
);
export const fetchTutorCourses = createAsyncThunk(
  'courses/fetchTutorCourses',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await userInstance.get('/coursemanagement/tutor-courses/', {
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
export const orderStatusChange=createAsyncThunk(
'courses/orderStatusChange',
async(courseId,{getState,rejectWithValue})=>{
  try{
    console.log("orderstatuschange is being sending data")
    const { user } = getState().auth;
    const accessToken = localStorage.getItem(`${user.email}_access_token`);
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await userInstance.patch(`/coursemanagement/orderstatuschange/${courseId}/`,
    { isstart: true }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
   
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response ? error.response.data : { message: error.message });
  }  
  }

)
export const fetchCourseDetail = createAsyncThunk(
  'courses/fetchCourseDetail',
  async (courseId, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await userInstance.get(`/coursemanagement/courses/${courseId}/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      console.log("the response data we get from course detail is",response.data,)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
  }
);


const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    tutorcourses:[],
    purchasedCourses:[],
    currentCourse:null,
    status: 'idle',
    error: null,
    currentPage: 1,
    hasMore: true
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tutorcourses.push(action.payload);
      })

      .addCase(addCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteCourse.pending, (state) => {
        state.status = 'loading';

      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tutorcourses = state.tutorcourses.filter(course => course.id !== action.payload);
      })

      .addCase(deleteCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(orderStatusChange.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(orderStatusChange.fulfilled, (state, action) => {
        state.status = 'succeeded';
       
      })
      .addCase(orderStatusChange.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAllCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Filter out duplicate courses
        const newCourses = action.payload.courses.filter(
          (newCourse) => !state.courses.some((existingCourse) => existingCourse.id === newCourse.id)
        );

        state.courses = [...state.courses, ...newCourses];
        state.currentPage = action.payload.currentPage;
        state.hasMore = action.payload.hasMore;
              // state.courses = [...state.courses, ...action.payload.courses];
        // state.currentPage = action.payload.currentPage;
        // state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchPurchasedCourses.fulfilled,(state,action)=>{
        state.status='succeeded';
        state.purchasedCourses=action.payload;
      })
      .addCase(fetchPurchasedCourses.pending,(state)=>{
        state.status="loading";
      })
      .addCase(fetchPurchasedCourses.rejected,(state,action)=>{
        state.status="failed";
        state.error = action.payload?.message || "An error occurred";
      })
      .addCase(fetchTutorCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTutorCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tutorcourses = action.payload;
      })
      .addCase(fetchTutorCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchCourseDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourseDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentCourse = action.payload;
        // state.lessons = action.payload.lessons;
      })
      .addCase(fetchCourseDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default courseSlice.reducer;