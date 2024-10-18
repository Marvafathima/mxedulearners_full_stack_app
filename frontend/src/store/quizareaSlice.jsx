import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userInstance as axios} from '../api/axios';


// Helper function to get the access token
const getAccessToken = (getState) => {
    const { user } = getState().auth;
    return localStorage.getItem(`${user.email}_access_token`);
  };
  
  // Helper function to create authorized axios instance
  const createAuthorizedAxios = (getState) => {
    const accessToken = getAccessToken(getState);
    return axios.create({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  };

  export const fetchCourseQuizzes = createAsyncThunk(
    'quiz/fetchCourseQuizzes',
    async (courseId, { getState, rejectWithValue }) => {
      try {
        const authorizedAxios = createAuthorizedAxios(getState);
        const response = await authorizedAxios.get(`/quizmanagement/courses/${courseId}/quizzes/`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
// Async thunks
export const fetchQuiz = createAsyncThunk(
    'quiz/fetchQuiz',
    async (quizId, { getState, rejectWithValue }) => {
      try {
        const authorizedAxios = createAuthorizedAxios(getState);
        const response = await authorizedAxios.get(`/quizmanagement/quizzes/${quizId}/`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
//   export const submitQuiz = createAsyncThunk(
//     'quiz/submitQuiz',
//     async (_, { getState, rejectWithValue }) => {
//       try {
//         const authorizedAxios = createAuthorizedAxios(getState);
//         const { quiz, answers } = getState().quiz;
//         const response = await authorizedAxios.post(`/quizmanagement/quizzes/${quiz.id}/submit/`, { answers });
//         return response.data;
//       } catch (error) {
//         return rejectWithValue(error.response.data);
//       }
//     }
//   );
export const submitQuiz = createAsyncThunk(
    'quiz/submitQuiz',
    async ({ selectedAnswers, quizId }, { getState, rejectWithValue }) => {
      try {
        const authorizedAxios = createAuthorizedAxios(getState);
        const response = await authorizedAxios.post(`/quizmanagement/quizzes/${quizId}/submit/`, { answers: selectedAnswers });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const answerQuestion = createAsyncThunk(
    'quiz/answerQuestion',
    async ({ questionId, answerId }, { getState, rejectWithValue }) => {
      try {
        const authorizedAxios = createAuthorizedAxios(getState);
        const { quiz } = getState().quiz;
        const response = await authorizedAxios.post(`/quizmanagement/quizzes/${quiz.id}/questions/${questionId}/answer/`, { answerId });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  

const quizareaSlice = createSlice({
  name: 'quizarea',
  initialState: {
    currentQuiz: null,
    currentQuestionIndex: 0,
    courseQuizzes: [],
    answers: {},
    score: 0,
    percentage: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchCourseQuizzes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourseQuizzes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courseQuizzes = action.payload;
      })
      .addCase(fetchCourseQuizzes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.courseQuizzes=action.payload
      })
      .addCase(fetchQuiz.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuiz.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.status = 'submitted';
        state.score = action.payload.score;
        state.percentage = action.payload.percentage;
        // Handle the submitted quiz result here
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
    })
      .addCase(answerQuestion.fulfilled, (state, action) => {
        const { questionId, answerId } = action.payload;
        state.answers[questionId] = answerId;
      });
  },
});

export const { setCurrentQuestion } = quizareaSlice.actions;

export default quizareaSlice.reducer;