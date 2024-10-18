// userProgressSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userInstance as axios} from '../api/axios'
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
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response ? error.response.data : { message: error.message });
      }
    }
  );
export const fetchUserProgress = createAsyncThunk(
  'userProgress/fetchUserProgress',
  async (courseId, { getState,rejectWithValue }) => {
    try{
      const {user}=getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token available');
      }
        const response = await axios.get(`/coursemanagement/user-progress-list/${courseId}/`,{
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        console.log("list of all courses lessson progress fetched",response.data)
        return response.data;
    }
    catch(error){
        return rejectWithValue(error.response ? error.response.data : { message: error.message });
    } 
   
  }
  
);

export const updateUserProgress = createAsyncThunk(
  'userProgress/updateUserProgress',
  async ({ courseId, lessonId, progress }, { rejectWithValue }) => {
    try{
        const response = await axios.put(`/coursemanagement/user-progress/${courseId}/${lessonId}/`, {
            lesson_id: lessonId,
            progress,
          });
          return response.data;
    }
    catch(error){
        return rejectWithValue(error.response ? error.response.data : { message: error.message });
    }
   
  }
);

const userProgressSlice = createSlice({
  name: 'userProgress',
  initialState: {
    userProgress: {},
    currentCourse:null,
    lessons:[],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchCourseDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourseDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentCourse = action.payload.course;
        state.lessons = action.payload.lessons;
      })
      .addCase(fetchCourseDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchUserProgress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userProgress = action.payload;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateUserProgress.fulfilled, (state, action) => {
        const { lesson, last_watched_position, is_completed } = action.payload;
        state.userProgress[lesson] = { last_watched_position, is_completed };
      });
  },
});

export default userProgressSlice.reducer;