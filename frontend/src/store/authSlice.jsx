import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { instance as axios } from '../api/axios'
import { userInstance } from '../api/axios';
axios.defaults.withCredentials = true;


const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
  // user: null,
  // isAuthenticated: false,
  role:null,
  loading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
};



export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/register', formData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ error: 'An unexpected error occurred' });
      }
    }
  }
);
export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/verify-otp', otpData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//forgot password 
export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (data, { rejectWithValue }) => {
      try {
          const response = await axios.post('/forgot_password/', data);
          return response.data;
      } catch (error) {
          return rejectWithValue(error.response.data);
      }
  }
);
//forgot password 
export const confirmPasswordReset = createAsyncThunk(
  'auth/confirmPasswordReset',
  async (data, { rejectWithValue }) => {
      try {
          const response = await axios.post('/confirm_forgot_password/', data);
          return response.data;
      } catch (error) {
          return rejectWithValue(error.response.data);
      }
  }
);


export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/login', credentials);
     
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const submitTutorApplication = createAsyncThunk(
  'auth/submitTutorApplication',
  async (applicationData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/tutor_application', applicationData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }

);
export const fetchTutorDetails = createAsyncThunk(
  'auth/fetchTutorDetails',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const response = await userInstance.get(`/admin/usermanagement/tutor-details/${user.id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchStudentProfile = createAsyncThunk(
  'auth/fetchStudentDetails',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const response = await userInstance.get(`admin/usermanagement/student_details/${user.id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  'auth/updateProfilePicture',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      console.log("accesst oken in the update profile picture*****",accessToken)
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const response = await userInstance.patch(`/admin/usermanagement/update-profile-picture/${user.id}/`, formData, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const response = await userInstance.patch(`/admin/usermanagement/update-profile/${user.id}/`, profileData, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)

// editEducation,addEducation
export const editEducation = createAsyncThunk(
  'auth/editEducation',
  async ({formData,tutorId}, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const response = await userInstance.patch(`/admin/usermanagement/update-education/${user.id}/${tutorId}/`, formData, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type':  'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)
export const addEducation = createAsyncThunk(
  'auth/addnewEducation',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const response = await userInstance.post(`/admin/usermanagement/add-education/${user.id}/`, formData, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type':  'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
)

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwordData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const response = await userInstance.post(`/admin/usermanagement/update-password/${user.id}/`, passwordData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const fetchStudentDetails = createAsyncThunk(
  'auth/fetchStudentDetails',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const response = await userInstance.get('/student/details/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    const { user, role } = getState().auth;
    const rolePrefix = role === 'tutor' ? 'tutor_' : 'student_';

    localStorage.removeItem(`${user.email}_access_token`);
    localStorage.removeItem(`${user.email}_refresh_token`);
    localStorage.removeItem(`${user.email}_role`);
    localStorage.removeItem('user');
    localStorage.removeItem('current_user');
    
    return true;
    // You might want to call an API endpoint to invalidate the token on the server
    // await axios.post('/api/logout');
  }
);

export const profilesendVerificationOTP = createAsyncThunk(
  'auth/profilesendVerificationOTP',
  async (email, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      console.log(`new updated email is sending to backend for verification${email}`)
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const response = await userInstance.post('/admin/usermanagement/send-otp/', { email }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const profileverifyOTP = createAsyncThunk(
  'auth/profileverifyOTP',
  async ({ email, otp }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const response = await userInstance.post('/admin/usermanagement/verify-otp/', { email, otp }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const preupdateProfile = createAsyncThunk(
  'auth/preupdateProfile',
  async (profileData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().auth;
      const accessToken = localStorage.getItem(`${user.email}_access_token`);
      if (!accessToken) {
        throw new Error('No access token found');
      }
      const response = await userInstance.patch(`/admin/usermanagement/preupdate/${user.id}/`, profileData, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
 
    reducers: {
      logout: (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.role = null;
       
      },

      setUser: (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.role = action.payload.role;
        localStorage.setItem('user', JSON.stringify(action.payload));
      },
    },
 

 
  extraReducers: (builder) => {
    builder
    .addCase(profilesendVerificationOTP.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.otpSent = false;
      console.log("pendings")
    })
    .addCase(profilesendVerificationOTP.fulfilled, (state) => {
      state.loading = false;
      state.otpSent = true;
      console.log("fulfilled")
    })
    .addCase(profilesendVerificationOTP.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.otpSent = false;
      console.log("rejected")
    })

    // verifyOTP
    .addCase(profileverifyOTP.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.otpVerified = false;
    })
    .addCase(profileverifyOTP.fulfilled, (state) => {
      state.loading = false;
      state.otpVerified = true;
    })
    .addCase(profileverifyOTP.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.otpVerified = false;
    })

    // updateProfile
    .addCase(preupdateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(preupdateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(preupdateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(editEducation.pending,(state,action)=>{
      state.loading=true;
      state.error=null
    })
    .addCase(editEducation.fulfilled, (state, action) => {
      state.loading = false;
      if (state.user && state.user.tutor_application) {
        state.user.tutor_application = {
          ...state.user.tutor_application,
          ...action.payload
        };
      }
      state.error = null;
    })
    // .addCase(editEducation.fulfilled,(state,action)=>{
    //   state.loading=false;
    //   state.user.tutor_application=action.payload;
    //   state.error=null
    // })
    .addCase(editEducation.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload;
    })
    .addCase(addEducation.pending,(state,action)=>{
      state.loading=true;
      state.error=null
    })
    .addCase(addEducation.fulfilled, (state, action) => {
      state.loading = false;
      if (state.user && state.user.tutor_application) {
        // Assuming tutor_application is an array of education entries
        state.user.tutor_application = [
          ...state.user.tutor_application,
          action.payload
        ];
      } else if (state.user) {
        // If tutor_application doesn't exist yet, initialize it
        state.user.tutor_application = [action.payload];
      }
      state.error = null;
    })
    
    .addCase(addEducation.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload;
    })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      }).addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.user.role;
      })
      .addCase(fetchStudentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(fetchStudentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch student details';
      })
    
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.role = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.non_field_errors?.[0] || action.payload || 'An error occurred';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload
        
        state.role = action.payload.user.role;
        const username = action.payload.user.email;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      
        const rolePrefix = action.payload.user.role === 'tutor' ? 'tutor_' : 'student_';
        localStorage.setItem(`${username}_access_token`, action.payload.access);
        localStorage.setItem(`${username}_refresh_token`, action.payload.refresh);
        localStorage.setItem(`${username}_role`, action.payload.user.role);
        localStorage.setItem('current_user', username);

    })
    .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        console.log("rejected",state.error)
    })
    .addCase(submitTutorApplication.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(submitTutorApplication.fulfilled, (state, action) => {
      state.loading = false;
      // You can update the user state here if needed
    })
    .addCase(submitTutorApplication.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to submit tutor application';
    })
    .addCase(updateProfilePicture.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateProfilePicture.fulfilled, (state, action) => {
      state.loading = false;
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    })
    .addCase(updateProfilePicture.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update profile picture';
    })
   
    .addCase(fetchTutorDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchTutorDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    })
    .addCase(fetchTutorDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch tutor details';
    })
    .addCase(updateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    })
    .addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to update profile';
    })
    .addCase(updatePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updatePassword.fulfilled, (state) => {
      state.loading = false;
    })
    .addCase(updatePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Invalid OTP';
    })
    // forgotpassword extra reducers
    .addCase(requestPasswordReset.pending, (state) => {
      state.loading = true;
  })
  .addCase(requestPasswordReset.fulfilled, (state) => {
      state.loading = false;
  })
  .addCase(requestPasswordReset.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
  })
  .addCase(confirmPasswordReset.pending, (state) => {
      state.loading = true;
  })
  .addCase(confirmPasswordReset.fulfilled, (state) => {
      state.loading = false;
  })
  .addCase(confirmPasswordReset.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
  });
    
  },
});

export const { logout,setUser} = authSlice.actions;

export default authSlice.reducer;

