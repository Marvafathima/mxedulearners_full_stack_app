import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { userInstance as axios} from '../api/axios';
const API_URL = '/quizmanagement/quizzes/';

export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addQuiz = createAsyncThunk(
  'quizzes/addQuiz',
  async (quizData, { getState, rejectWithValue }) => {
    try { 
      const { user } = getState().auth;
      console.log("sending quiz data")
      console.log(quizData)
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token available');
      }
      const response = await axios.post(API_URL, quizData,
        {headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
        
        );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// export const updateQuiz = createAsyncThunk(
//   'quizzes/updateQuiz',
//   async ({id,quizData,questions }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`${API_URL}edit-quiz/${id}/`, quizData,questions);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const updateQuiz = createAsyncThunk(
  'quizzes/updateQuiz',
  async ({quizId,questionId, updatedQuestion }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}edit-quiz/${quizId}/${questionId}/`, updatedQuestion);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



// export const updateQuiz = createAsyncThunk(
//   'quizzes/updateQuiz',
//   async ({ id, quizData }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(`${API_URL}${id}/`, quizData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const deleteQuiz = createAsyncThunk(
  'quizzes/deleteQuiz',
  async (id, { rejectWithValue }) => {
    try {

      await axios.delete(`${API_URL}${id}/`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const quizSlice = createSlice({
  name: 'quizzes',
  initialState: {
    quizzes: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addQuiz.pending, (state, action) => {
        state.status='loading'
      })
      .addCase(addQuiz.fulfilled, (state, action) => {
        state.quizzes.push(action.payload);
      })
       .addCase(addQuiz.rejected, (state, action) => {
        console.log(`add quiz error${action.payload.error}`)
        state.error=action.payload.error
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.status='succeeded';
        state.quizzes=action.payload
        // const index = state.quizzes.findIndex(quiz => quiz.id === action.payload.id);
        // if (index !== -1) {
        //   state.quizzes[index] = action.payload;
        // }
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter(quiz => quiz.id !== action.payload);
      });
  },
});

export default quizSlice.reducer;