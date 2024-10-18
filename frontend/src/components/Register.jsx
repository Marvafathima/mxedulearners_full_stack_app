import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
const Register = ({ onSuccess,onError }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    role: 'student',
  });
  const [formErrors, setFormErrors] = useState({email:"",phone_number:""});
  const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.username) errors.username = 'Username is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.phone_number) errors.phone_number = 'Phone number is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password !== formData.confirm_password) errors.confirm_password = 'Passwords do not match';
    return errors;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        const result = await dispatch(registerUser(formData));
        if (registerUser.fulfilled.match(result)) {
          onSuccess(result.payload.email, result.payload.user_id);
        } else if (registerUser.rejected.match(result)) {
          const { email, phone_number } = result.payload;
        
          const errorMessage = [];

           if (email && phone_number){
            errorMessage.push(...email);
            errorMessage.push(...phone_number);
            toast.error(errorMessage[0])
            toast.error(errorMessage[1])
           }
           else if(email){
            errorMessage.push(...email);
            toast.error(errorMessage[0])
           }
           else if(phone_number){
            errorMessage.push(...phone_number);
            toast.error(errorMessage[0])
           }

         

        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    }
     else {
      // setFormErrors(errors);
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const errors = validateForm();
  //   if (Object.keys(errors).length === 0) {
  //     dispatch(registerUser(formData)).then((result) => {
  //       if (result.payload) {
  //         onSuccess(result.payload.email, result.payload.user_id);
  //       }
  //       else{
  //         alert("user already exist with this email or phonenumber,use different id")
  //       }
  //     });
     



  //   } else {
  //     setFormErrors(errors);
  //   }
  // };

  


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label>Enter your name</label>
      <input 
        type="text" 
        name="username" 
        value={formData.username} 
        onChange={handleChange} 
        placeholder="Username" 
        className="w-full p-2 border rounded"
      />
      {formErrors.username && <p className="text-red-500">{formErrors.username}</p>}
      <label>Enter your email</label>
      <input 
        type="email" 
        name="email" 
        value={formData.email} 
        onChange={handleChange} 
        placeholder="Email" 
        className="w-full p-2 border rounded"
      />
      {formErrors.email && <p className="text-red-500">{formErrors.email}</p>}
      <label>Enter your Phone Number</label> 
      <input 
        type="tel" 
        name="phone_number" 
        value={formData.phone_number} 
        onChange={handleChange} 
        placeholder="Phone Number" 
        className="w-full p-2 border rounded"
      />
      {formErrors.phone_number && <p className="text-red-500">{formErrors.phone_number}</p>}
      <label>Enter your password</label>
      <input 
        type="password" 
        name="password" 
        value={formData.password} 
        onChange={handleChange} 
        placeholder="Password" 
        className="w-full p-2 border rounded"
      />
      {formErrors.password && <p className="text-red-500">{formErrors.password}</p>}
      <label>Confirm Password</label>  
      <input 
        type="password" 
        name="confirm_password" 
        value={formData.confirm_password} 
        onChange={handleChange} 
        placeholder="Confirm Password" 
        className="w-full p-2 border rounded"
      />
      {formErrors.confirm_password && <p className="text-red-500">{formErrors.confirm_password}</p>}
      <label>Enter your role</label> 
      <select 
        name="role" 
        value={formData.role} 
        onChange={handleChange}
        className="w-full p-2 border rounded"
      >
        <option value="student">Student</option>
        <option value="tutor">Tutor</option>
        <option value="admin">Admin</option>
      </select>
      
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Register
      </button>
      {/* {error && error.email && <p className="text-red-500">{error.email}</p>}
      {error && error.phone_number && <p className="text-red-500">{error.phone_number}</p>}
    */}
    </form>



  );
};

export default Register;