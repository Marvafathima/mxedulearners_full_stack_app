import { createSlice } from '@reduxjs/toolkit';

const tutorQuizSlice = createSlice({
  name: 'tutorquiz',
  initialState: {
    quizzes: [],
  },
  reducers: {
    settutorQuizzes: (state, action) => {
      state.quizzes = action.payload;
    }
  }
});

export const { settutorQuizzes } = tutorQuizSlice.actions;
export default tutorQuizSlice.reducer;
