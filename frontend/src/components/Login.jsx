
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, setUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CircularProgress,Box } from '@mui/material';
import ForgotPassword from './ForgotPassword';
const Login = (onError) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [showForgotPassword, setShowForgotPassword] = useState(false);

    if (showForgotPassword) {
        return <ForgotPassword />;
    }
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(result)) {
        dispatch(setUser(result.payload.user));
        if (result.payload.user.role === 'tutor') {
          navigate('/tutor-home');
          toast.success('Logged in successfully as tutor!');
        } else if (result.payload.user.role === 'student') {
          navigate('/student-home');
          toast.success('Logged in successfully as student!');
        }
      
      } else if (loginUser.rejected.match(result)) {
        if (result.payload && result.payload) {
          
          toast.error("Login failed. Please check your credentials and try again.");
          console.log("error")
        } else {
          toast.error('Login failed. Please check your credentials and try again.');
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('An unexpected error occurred. Please try again later.');
    }
  };


if(loading){
  return(
    <div>
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
<CircularProgress />
</Box></div>
  )
}

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
    <label>Enter your email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full p-2 border rounded"
        required
      />
    <label>Enter your password</label>  
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="w-full text-blue-500 hover:underline"
            >
                Forgot Password?
            </button>
    </form>
  );
};

export default Login;