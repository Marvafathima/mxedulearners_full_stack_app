import { createSlice } from '@reduxjs/toolkit';

const selectedChatSlice = createSlice({
  name: 'selectedChat',
  initialState: {
    senderId: null,
  },
  reducers: {
    setSelectedChat: (state, action) => {
      state.senderId = action.payload;
    },
    clearSelectedChat: (state) => {
      state.senderId = null;
    },
  },
});

export const { setSelectedChat, clearSelectedChat } = selectedChatSlice.actions;
export default selectedChatSlice.reducer;