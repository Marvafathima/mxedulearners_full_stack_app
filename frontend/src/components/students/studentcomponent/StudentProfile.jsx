
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { fetchStudentProfile,updateProfilePicture,updateProfile, updatePassword  } from '../../../store/authSlice';
import ProfileSidebar from './ProfileSidebar';
import Navbar from './Navbar';
import { FaRankingStar, FaBookOpen, FaTrophy, FaPlus, FaTrash } from 'react-icons/fa6';
import { FaQuestionCircle } from 'react-icons/fa';
import { getFullImageUrl } from '../../../utils/auth';
import { toast } from 'react-toastify';
import { logoutUser } from '../../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { CircularProgress ,Box} from '@mui/material';

const StudentProfile = () => {
  const { darkMode } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const { user, loading, error} = useSelector((state) => state.auth);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [imageSrc, setImageSrc] = useState(() => getFullImageUrl(user.profile_pic));const [activeForm, setActiveForm] = useState(null);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone_number: '',
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_new_password: ''
  });
  const [imgError, setImgError] = useState(false);
 
  const handleImageError = () => {
    if (!imgError) {
      setError(true);
      setImageSrc(getFullImageUrl('path/to/fallback/image.png')); 
    }
  };

 
  const statsData = [
        { icon: <FaRankingStar />, label: 'Rank', value: '10' },
        { icon: <FaBookOpen />, label: 'Courses Purchased', value: '5' },
        { icon: <FaQuestionCircle />, label: 'Quiz Taken', value: '15' },
        { icon: <FaTrophy />, label: 'Score', value: '85%' },
      ];
  useEffect(() => {
    dispatch(fetchStudentProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
      });
    }
  }, [user]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_pic', file);
      try {
        const resultAction = await dispatch(updateProfilePicture(formData));
        if (updateProfilePicture.fulfilled.match(resultAction)) {
          const newImageUrl = resultAction.payload.profile_pic;
          setImageSrc(getFullImageUrl(newImageUrl));
          setImgError(false);
          toast.success('Profile picture updated successfully!');
          setShowProfileOptions(false);
        } else {
          throw new Error('Failed to update profile picture');
        }
      } catch (error) {
        toast.error('Failed to update profile picture. Please try again.');
        console.error('Error updating profile picture:', error);
      }
    }
  };
  const handleRemoveProfilePic = async () => {
    await dispatch(updateProfilePicture(null));
    setShowProfileOptions(false);
  };




  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(updateProfile(profileData));
      if (updateProfile.fulfilled.match(resultAction)) {
        setEditMode(false);
        // Optionally, show a success message
      } else if (updateProfile.rejected.match(resultAction)) {
        console.error('Update failed:', resultAction.error);
       
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("our password data:",passwordData)
      const resultAction = await dispatch(updatePassword(passwordData));
      if (updatePassword.fulfilled.match(resultAction)) {
        
        toast.success("password updated successfully.login again to continue")
        dispatch(logoutUser())
        navigate('/landing-page')
       
      } else if (updatePassword.rejected.match(resultAction)) {
        toast.error("Error updating Password.Please try again")
        console.error('Password update failed:', resultAction.error);
       
      }
    } catch (err) {
      console.error('Failed to update password:', err);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      username: user.username,
      email: user.email,
      phone_number: user.phone_number
    });
    setEditMode(false);
  };

  
  

  if (loading) return <div>
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
<CircularProgress />
</Box></div>;

return (
  <div className="min-h-screen flex flex-col">
    <Navbar user={user} className="fixed top-0 left-0 right-0 z-50" />
    <div className="flex flex-1 pt-16"> {/* Add top padding to account for fixed Navbar */}
      <ProfileSidebar className="fixed left-0 top-16 bottom-0 w-64 overflow-y-auto" />
      <div className="flex-1 ml-64 p-8 overflow-y-auto"> {/* Add left margin to account for Sidebar width */}
        <div className={`bg-${darkMode ? 'dark-gray-200' : 'light-blueberry'} rounded-lg shadow-md p-6`}>
          <div className={`flex items-center mb-6 ${darkMode ? 'text-dark-white' : 'text-white'}`}>
           
              <div className="relative">
  {user.profile_pic ? (
   
    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
    <img
      // src={getFullImageUrl(user.profile_pic)}
      src={imageSrc}
      alt="Profile"
      className="w-full h-full object-cover"
      onError={handleImageError}
  
    />
  </div>
  ) : (
    <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
      <i className="fas fa-user text-4xl text-gray-400"></i>
    </div>
  )}
  <button
    onClick={() => setShowProfileOptions(!showProfileOptions)}
    className={`absolute bottom-0 right-0 ${
      darkMode ? 'bg-dark-gray-100' : 'bg-light-apricot'
    } text-white rounded-full w-8 h-8 flex items-center justify-center`}
  >
    <i className="fas fa-plus"></i>
                </button>
                {showProfileOptions && (
                  <div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-dark-gray-100' : 'bg-white'} rounded-md shadow-lg py-1 z-10`}>
                    <label className={`block px-4 py-2 text-sm ${darkMode ? 'text-dark-white hover:bg-dark-gray-200' : 'text-gray-700 hover:bg-gray-100'} cursor-pointer`}>
                      {user.profile_pic ? 'Change Profile Pic' : 'Add Profile Pic'}
                      <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                    </label>
                    {user.profile_pic && (
                      <button
                        onClick={handleRemoveProfilePic}
                        className={`block w-full text-left px-4 py-2 text-sm ${darkMode ? 'text-dark-white hover:bg-dark-gray-200' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        Remove Profile Pic
                      </button>
                    )}
                  </div>
                )}
                  </div>
            <div>
              <h2 className="text-2xl font-semibold">{user.username}</h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-200'}`}>{user.email}</p>
              <h3 className="font-semibold mb-2">Phone: {user.phone_number}</h3>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6">
            {statsData.map((stat, index) => (
              <div key={index} className={`${darkMode ? 'bg-dark-gray-300' : 'bg-white'} p-4 rounded-lg shadow text-center`}>
                <div className={`text-3xl mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>{stat.icon}</div>
                <div className={`font-semibold ${darkMode ? 'text-dark-white' : 'text-gray-800'}`}>{stat.label}</div>
                <div className={`text-lg ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex space-x-4 justify-center">
          <button
            onClick={() => setActiveForm('editProfile')}
            className={`py-2 px-4 rounded ${
              activeForm === 'editProfile'
                ? 'bg-blue-500 text-white'
                : `${darkMode ? 'bg-dark-gray-200 text-dark-white' : 'bg-light-cyan text-gray-800'}`
            }`}
          >
            Edit Profile
          </button>
          <button
            onClick={() => setActiveForm('resetPassword')}
            className={`py-2 px-4 rounded ${
              activeForm === 'resetPassword'
                ? 'bg-blue-500 text-white'
                : `${darkMode ? 'bg-dark-gray-200 text-dark-white' : 'bg-light-cyan text-gray-800'}`
            }`}
          >
            Reset Password
          </button>
        </div>
        <div className="flex justify-center mt-4">
          {activeForm === 'editProfile' && (
            <form onSubmit={handleProfileSubmit} className={`w-1/2 mt-4 ${darkMode ? 'bg-dark-gray-200 text-black' : 'bg-light-darkcyan'} p-6 rounded-lg shadow`}>
              <div className="mb-4">
                <label className="block mb-2">Username</label>
                <input 
                type="text" 
                name="username"
                 value={profileData.username} 
                 onChange={handleProfileChange} 
                 className="w-full p-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Email</label>
                <input 
                type="email" 
                name="email" 
                value={profileData.email} 
                onChange={handleProfileChange} className="w-full p-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Phone Number</label>
                <input type="tel" name="phone_number" 
                value={profileData.phone_number} 
                onChange={handleProfileChange} 
                className="w-full p-2 border rounded" />
              </div>
              <button type="submit"
               className="bg-blue-500 text-white py-2 px-4 rounded">
                Save Changes
              </button>
            </form>
          )}
          {activeForm === 'resetPassword' && (
            <form onSubmit={handlePasswordSubmit} className={`w-1/2 mt-4 ${darkMode ? 'bg-dark-gray-200' : 'bg-light-darkcyan'} p-6 rounded-lg shadow`}>
              <div className="mb-4">
                <label className="block mb-2">Old Password</label>
                <input 
                type="password" 
                placeholder="Current Password" 
                 name="old_password"
                 value={passwordData.old_password}
                 onChange={handlePasswordChange}
                className="w-full p-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block mb-2">New Password</label>
                <input 
                type="password"
                name="new_password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                placeholder="New Password" 
                className="w-full p-2 border rounded" />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Confirm New Password</label>
                <input 
                type="password" 
                name="confirm_new_password"
                value={passwordData.confirm_new_password}
                onChange={handlePasswordChange}
                placeholder="Confirm New Password" 
                className="w-full p-2 border rounded" />
              </div>
              <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
   
  </div>
);
};
export default StudentProfile;