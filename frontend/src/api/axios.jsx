// import axios from 'axios';
// import { getCurrentUserTokens } from '../utils/auth';





// export const adminAxiosInstance = axios.create({
//   baseURL:'http://localhost:8000/api/users/admin',
//   withCredentials: true,
// });

// // Interceptor for admin instance
// adminAxiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('adminToken');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Refresh token function
// const refreshToken = async () => {
//   try {
//     const refreshToken = localStorage.getItem('adminRefreshToken');
//     const response = await axios.post(`${baseURL}token/refresh/`, { refresh: refreshToken });
//     return response.data.access;
//   } catch (error) {
//     throw error;
//   }
// };

// // Interceptor for handling token expiration
// adminAxiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const newToken = await refreshToken();
//         localStorage.setItem('adminToken', newToken);
//         originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
//         return adminAxiosInstance(originalRequest);
//       } catch (refreshError) {
//         // Handle refresh token failure (e.g., logout user)
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );
// const createAxiosInstance = (baseURL) => {
//   const instance = axios.create({ baseURL });

//   instance.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem('access_token');
//       if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   instance.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config;
//       if (error.response.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
//         try {
//           const refreshToken = localStorage.getItem('refresh_token');
//           const response = await axios.post('http://localhost:8000/api/users/token/refresh', { refresh: refreshToken });
//           const { access } = response.data;
//           localStorage.setItem('access_token', access);
//           console.log(access,"this is access token")
//           originalRequest.headers['Authorization'] = `Bearer ${access}`;
//           return instance(originalRequest);
//         } catch (refreshError) {
//           // Handle refresh token failure (e.g., logout user)
//           localStorage.removeItem('access_token');
//           localStorage.removeItem('refresh_token');
//           localStorage.removeItem('isAdmin');
//           // window.location.href = 'admin/login'; // Redirect to login page
//           return Promise.reject(refreshError);
//         }
//       }
//       return Promise.reject(error);
//     }
//   );

//   return instance;
// };




// const userInstance = axios.create({
//   baseURL: 'http://localhost:8000/api/users',
// });

// userInstance.interceptors.request.use((config) => {
//   const tokens = getCurrentUserTokens();
//   console.log("token in the axios fetvching check for authorization**********",tokens)
//   if (tokens && tokens.accessToken) {
//     config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
//   }
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// // Implement refresh token logic here

// export { userInstance };

// export const instance = createAxiosInstance('http://localhost:8000/api/users');
// export const authInstance = createAxiosInstance('http://localhost:8000/api/users');
// export const userManagementInstance = createAxiosInstance('http://localhost:8000/user_management');
// export const authUserManagementInstance = createAxiosInstance('http://localhost:8000/user_management');
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const getTokens = () => {
  const currentUser = localStorage.getItem('current_user');
  if (!currentUser) return null;

  return {
    accessToken: localStorage.getItem(`${currentUser}_access_token`),
    refreshToken: localStorage.getItem(`${currentUser}_refresh_token`),
  };
};

const setTokens = (accessToken, refreshToken) => {
  const currentUser = localStorage.getItem('current_user');
  if (!currentUser) return;

  localStorage.setItem(`${currentUser}_access_token`, accessToken);
  localStorage.setItem(`${currentUser}_refresh_token`, refreshToken);
};

const createAxiosInstance = (baseURL) => {
  const instance = axios.create({ baseURL, withCredentials: true });

  instance.interceptors.request.use(
    (config) => {
      const tokens = getTokens();
      if (tokens && tokens.accessToken) {
        config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const tokens = getTokens();
          if (!tokens || !tokens.refreshToken) {
            throw new Error('No refresh token found');
          }
          const response = await axios.post(`${BASE_URL}/api/users/token/refresh`, { refresh: tokens.refreshToken });
          const { access } = response.data;
          setTokens(access, tokens.refreshToken);
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // Handle refresh token failure (e.g., logout user)
          localStorage.removeItem('current_user');
          const currentUser = localStorage.getItem('current_user');
          if (currentUser) {
            localStorage.removeItem(`${currentUser}_access_token`);
            localStorage.removeItem(`${currentUser}_refresh_token`);
            localStorage.removeItem(`${currentUser}_role`);
          }
          localStorage.removeItem('user');
          // Redirect to login page or dispatch a logout action
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const userInstance = createAxiosInstance(`${BASE_URL}/api/users`);
export const adminInstance = createAxiosInstance(`${BASE_URL}/api/users/admin`);
export const userManagementInstance = createAxiosInstance(`${BASE_URL}/user_management`);

// For compatibility with your existing code
export const instance = userInstance;
export const authInstance = userInstance;
export const authUserManagementInstance = userManagementInstance;

// Admin specific instance
export const adminAxiosInstance = createAxiosInstance(`${BASE_URL}/api/users/admin`);

adminAxiosInstance.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers['Authorization'] = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// You might want to add a similar response interceptor for admin token refresh