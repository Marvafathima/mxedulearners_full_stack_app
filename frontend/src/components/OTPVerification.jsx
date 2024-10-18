
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOTP } from '../store/authSlice';
import { toast } from 'react-toastify';
import { InputOTP,InputOTPGroup,InputOTPSeparator,InputOTPSlot, } from './ui/input-otp';
const OTPVerification = ({ email,onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error,role } = useSelector((state) => state.auth);
  
  const [otp, setOtp] = useState('');
 

 

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyOTP({ email, otp })).then((result) => {
      if (!result.error) {
        toast.success("Account created successfully")
        onSuccess(result.payload.user.role);
      
      }
      else{
        toast.error("Invalid OTP")
      }
    
    });
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
    <p className="text-grey-200">Enter the OTP sent to {email}</p>
   
    <input
      type="text"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      placeholder="OTP"
      className="w-full p-2 border rounded"
      required
    />
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
    >
      Verify OTP
    </button>
    {error && <p className="text-red-500">{error}</p>}
  </form>
   
  );
};

export default OTPVerification;