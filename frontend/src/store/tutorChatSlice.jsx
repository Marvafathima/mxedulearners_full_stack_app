import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userInstance } from '../api/axios';


export const fetchMyStudents = createAsyncThunk(
    'chat/fetchMyStudents',
    async (tutorId, { getState, rejectWithValue }) => {
      try {
        const { user } = getState().auth;
        const accessToken = localStorage.getItem(`${user.email}_access_token`);
        if (!accessToken) {
          throw new Error('No access token found');
        }
        const response = await userInstance.get(`chat/tutor/${tutorId}/students/`, {
          headers: { 
            Authorization: `Bearer ${accessToken}`
          }
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  )

  export const fetchMyTutors = createAsyncThunk(
    'chat/fetchMyTutors',
    async (studentId, { getState, rejectWithValue }) => {
      try {
        const { user } = getState().auth;
        const accessToken = localStorage.getItem(`${user.email}_access_token`);
        if (!accessToken) {
          throw new Error('No access token found');
        }
        const response = await userInstance.get(`chat/student/${studentId}/tutors/`, {
          headers: { 
            Authorization: `Bearer ${accessToken}`
          }
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  )

  export const fetchChatHistory = createAsyncThunk(
    'chat/fetchChatHistory',
    async (roomName, { getState, rejectWithValue }) => {
      try {
        const { user } = getState().auth;
        const accessToken = localStorage.getItem(`${user.email}_access_token`);
        if (!accessToken) {
          throw new Error('No access token found');
        }
        const response = await userInstance.get(`chat/messages/chat_history/?room_name=${roomName}`, {
          headers: { 
            Authorization: `Bearer ${accessToken}`
          }
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  )

  export const markNotificationAsRead = createAsyncThunk(
    'tutorChat/markNotificationAsRead',
    async (notificationId, { getState,rejectWithValue }) => {
      try {
        const { user } = getState().auth;
        const accessToken = localStorage.getItem(`${user.email}_access_token`);
        if (!accessToken) {
          throw new Error('No access token found');
        }
        const response = await userInstance.patch(`/notifications/${notificationId}/`, { is_read: true });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (messageData, { getState, rejectWithValue }) => {
      try {
        const { user } = getState().auth;
        const accessToken = localStorage.getItem(`${user.email}_access_token`);
        if (!accessToken) {
          throw new Error('No access token found');
        }
        const response = await userInstance.post('chat/messages/send_message/', messageData, {
          headers: { 
            Authorization: `Bearer ${accessToken}`
          }
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  )

  export const clearAllNotifications = createAsyncThunk(
    'notifications/clearAll',
    async (_, { rejectWithValue }) => {
      try {
        const response = await userInstance.post('chat/notifications/mark-all-read');
        return response.data;
      } catch (error) {
        console.error('Error clearing all notifications:', error);
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  // Thunk action for removing a single notification
  export const removeNotification = createAsyncThunk(
    'notifications/remove',
    async (notificationId, { rejectWithValue }) => {
      try {
        const response = await userInstance.post(`chat/notifications/${notificationId}/mark-read`);
        return { id: notificationId, data: response.data };
      } catch (error) {
        console.error(`Error removing notification ${notificationId}:`, error);
        return rejectWithValue({ id: notificationId, error: error.response.data });
      }
    }
  );


  // export const fetchChatHistory = createAsyncThunk(
  //   'chat/fetchChatHistory',
  //   async (roomName) => {
  //     const response = await userInstance.get(`chat/messages/chat_history/?room_name=${roomName}`,{
  //       headers: { 
  //         Authorization: `Bearer ${accessToken}`
  //       }
  //     });
  //     return response.data;
  //   }
  // );
  
  // export const sendMessage = createAsyncThunk(
  //   'chat/sendMessage',
  //   async (messageData) => {
  //     const response = await userInstance.post('chat/messages/send_message/', messageData,{
  //       headers: { 
  //         Authorization: `Bearer ${accessToken}`
  //       }
  //     });
  //     return response.data;
  //   }
  // );



  const tutorChatSlice = createSlice({
    name: 'chats',
    initialState: {
      students: [],
      messages:{},
      notifications:[],
      tutors:[],
      status: 'idle',
      error: null,
    },
    reducers: {
      addMessage: (state, action) => {
        const { roomName, message } = action.payload;
        if (!state.messages[roomName]) {
          state.messages[roomName] = [];
        }
        state.messages[roomName].push(message);
      },
      addNotification: (state, action) => {
        state.notifications.push({
          ...action.payload,
          is_read: false
        });
      },
      clearNotifications: (state, action) => {
        const senderId = action.payload;
        state.notifications = state.notifications.filter(n => n.sender_id !== senderId || n.is_read);
      },
    
    },
    extraReducers: (builder) => {
      builder

      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.messages[action.meta.arg] = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { room_name, ...message } = action.payload;
        if (!state.messages[room_name]) {
          state.messages[room_name] = [];
        }
        state.messages[room_name].push(message);
      })
        .addCase(fetchMyStudents.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchMyStudents.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.students = action.payload.students;
        })
        .addCase(fetchMyStudents.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })

        .addCase(fetchMyTutors.pending, (state) => {
            state.status = 'loading';
          })
          .addCase(fetchMyTutors.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.tutors = action.payload.tutors;
          })
          .addCase(fetchMyTutors.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
          })
          .addCase(markNotificationAsRead.fulfilled, (state, action) => {
            const index = state.notifications.findIndex(n => n.notification_id === action.payload.id);
            if (index !== -1) {
              state.notifications[index].is_read = true;
            }
          })
          .addCase(clearAllNotifications.pending, (state) => {
            state.loading = true;
          })
          .addCase(clearAllNotifications.fulfilled, (state) => {
            state.notifications = [];
            state.loading = false;
            state.error = null;
          })
          .addCase(clearAllNotifications.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          })
          // Handle removeNotificationThunk
          .addCase(removeNotification.pending, (state) => {
            state.loading = true;
          })
          .addCase(removeNotification.fulfilled, (state, action) => {
            state.notifications = state.notifications.filter(
              (notif) => notif.id !== action.payload.id
            );
            state.loading = false;
            state.error = null;
          })
          .addCase(removeNotification.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.error;
          });
  


    },
    });
 export const { addMessage , addNotification, clearNotifications } = tutorChatSlice.actions;
    export default tutorChatSlice.reducer;