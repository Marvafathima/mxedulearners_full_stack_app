import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestPasswordReset, confirmPasswordReset } from '../store/authSlice';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleRequestReset = async (e) => {
        e.preventDefault();
        try {
            const result = await dispatch(requestPasswordReset({ email }));
            if (requestPasswordReset.fulfilled.match(result)) {
                setStep(2);
                toast.success('OTP sent to your email');
            } else {
                toast.error('Failed to send OTP. Please try again.');
            }
        } catch (err) {
            toast.error('An unexpected error occurred');
        }
    };

    const handleConfirmReset = async (e) => {
        e.preventDefault();
        try {
            const result = await dispatch(confirmPasswordReset({ email, otp, new_password: newPassword }));
            if (confirmPasswordReset.fulfilled.match(result)) {
                toast.success('Password reset successfully');
                // Redirect to login or close modal
            } else {
                toast.error('Failed to reset password. Please try again.');
            }
        } catch (err) {
            toast.error('An unexpected error occurred');
        }
    };

    if (step === 1) {
        return (
            <form onSubmit={handleRequestReset} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-2 border rounded"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    {loading ? 'Sending...' : 'Send OTP'}
                </button>
            </form>
        );
    }

    return (
        <form onSubmit={handleConfirmReset} className="space-y-4">
            <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="OTP"
                className="w-full p-2 border rounded"
                required
            />
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full p-2 border rounded"
                required
            />
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                {loading ? 'Resetting...' : 'Reset Password'}
            </button>
        </form>
    );
};

export default ForgotPassword;