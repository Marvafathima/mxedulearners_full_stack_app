// src/components/AdminLoginPage.jsx
import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate,Link} from 'react-router-dom';
// import { adminLogin } from '../../store/adminAuthSlice';
import { loginAdmin } from '../../store/adminAuthSlice';
const AdminLoginPage = () => {
  useEffect(() => {
    console.log("AdminLoginPage component mounted");
  }, []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.adminAuth);
 
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const [formErrors, setFormErrors] = useState({});
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log("upto handlechange")
  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.password) errors.password = 'Password is required';
    return errors;
  };
  console.log(formData.email,formData.password,"hereee")
  console.log("validation")

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        console.log(formData.email,formData.password,"tttttthereee")
        const resultAction =await dispatch(loginAdmin({ email: formData.email, password: formData.password }));
        console.log('Login action result:', resultAction);
        if (loginAdmin.fulfilled.match(resultAction)) {
          console.log('Login successful, navigating to dashboard');
          navigate('/admin/dashboard');
        } else if (loginAdmin.rejected.match(resultAction)) {
          console.error('Login failed:', resultAction.error);
          setFormErrors({ general: resultAction.error.message });
        }
      } catch (err) {
        console.error('Error during login:', err);
        setFormErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } else {
      setFormErrors(errors);
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
   
  //   console.log(formData.email,formData.password)
  //   const errors = validateForm();
  //   if (Object.keys(errors).length === 0) {
  //     try {
  //       console.log(formData.email,formData.password)
  //       const resultAction =dispatch(loginAdmin({ email: formData.email, password: formData.password }));
  //       // const resultAction = await dispatch(adminLogin(formData));
  //       console.log('Login action result:', resultAction);
  //       if (loginAdmin.fulfilled.match(resultAction)) {
  //         console.log('Login successful, navigating to dashboard');
          
  //         navigate('/admin/dashboard');
  //       } else if (loginAdmin.rejected.match(resultAction)) {
  //         console.error('Login failed:', resultAction.error);
  //         setFormErrors({ general: resultAction.error.message });
  //       }
  //     } catch (err) {
  //       console.error('Error during login:', err);
  //       setFormErrors({ general: 'An unexpected error occurred. Please try again.' });
  //     }
  //   } else {
  //     setFormErrors(errors);
  //   }
  // };
  

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-admin-primary">
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-admin-primary focus:border-admin-primary focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            {formErrors.email && (
              <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-admin-primary focus:border-admin-primary focus:z-10 sm:text-sm"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {formErrors.password && (
              <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
             
              
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-admin-primary hover:bg-admin-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-primary"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
        {error && <p className="mt-2 text-center text-sm text-red-600">{error}</p>}
         {/* Add the link to landing page here */}
         <div className="mt-4 text-center">
          <p className="text-sm">
            Go back to{' '}
            <Link to="/landing-page" className="text-admin-primary hover:underline">
              Landing Page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;