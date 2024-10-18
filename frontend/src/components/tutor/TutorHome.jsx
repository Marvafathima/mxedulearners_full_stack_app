

import React, { useEffect,useRef,useContext,useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTutorDetails,updateProfilePicture, updateProfile, updatePassword} from '../../store/authSlice';
import { ThemeContext } from '../../contexts/ThemeContext';
import { getFullImageUrl } from '../../utils/auth';
import TutorSidebar from './TutorSidebar';
import TutorNavbar from './TutorNavbar';
import { toast } from 'react-toastify';
import { logoutUser } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { CircularProgress ,Box} from '@mui/material';
import TutorLayout from './TutorLayout';
const TutorHome = () => {
  const { darkMode } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const effectRan = useRef(false);
  const navigate=useNavigate();
  const [imageSrc, setImageSrc] = useState(() => getFullImageUrl(user.profile_pic));
  const [imgError, setImgError] = useState(false);
 
  const handleImageError = () => {
    if (!imgError) {
     
      setImageSrc(getFullImageUrl('path/to/fallback/image.png')); // Make sure this fallback image exists in your S3 bucket
    }
  };

  // if (!imageSrc) {
  //   return <div>No image available</div>;
  // }

  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [activeForm, setActiveForm] = useState('profile'); // 'profile' or 'password'
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone_number: ''
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_new_password: ''
  });
  useEffect(() => {
    if (effectRan.current === false) {
      if (user && user.role === 'tutor') {
        dispatch(fetchTutorDetails());
      }
      return () => {
        effectRan.current = true;
      };
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username,
        email: user.email,
        phone_number: user.phone_number
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
        // Reset password fields and show success message
        toast.success("password updated successfully.login again to continue")
        dispatch(logoutUser())
        navigate('/landing-page')
        // setPasswordData({ old_password: '', new_password: '', confirm_new_password: '' });
        // Optionally, show a success message
      } else if (updatePassword.rejected.match(resultAction)) {
        toast.error("Error updating Password.Please try again")
        console.error('Password update failed:', resultAction.error);
        // Optionally, show an error message
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
</Box>
</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data available</div>;
  const sidebarItems = [
    { name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
    { name: 'My Profile', icon: 'fas fa-user' },
    { name: 'Students', icon: 'fas fa-users' },
    { name: 'Courses', icon: 'fas fa-book' },
    { name: 'Schedule', icon: 'fas fa-calendar-alt' },
    { name: 'Chat', icon: 'fas fa-comments' },
    { name: 'Revenue', icon: 'fas fa-chart-line' },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
<TutorLayout user={user}>

<div className={`flex h-screen ${darkMode ? 'bg-dark-gray-300' : 'bg-light-applecore'}`}>
     
      
      
      {/* <TutorSidebar user={user}></TutorSidebar> */}

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-dark-gray-200' : 'bg-white'}`}>
          {/* Profile Header */}
          <div className="relative mb-6">
            <div className={`h-32 ${darkMode ? 'bg-dark-gray-100' : 'bg-light-citrus'} rounded-t-lg`}></div>
            <div className="absolute bottom-0 left-6 transform translate-y-1/2">
           
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
            </div>
          </div>
              
              
              
              
            
          <div className="mt-16 grid grid-cols-2 gap-4">
            <div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-dark-white' : 'text-light-blueberry'}`}>
                {user.username}
              </h2>
              <p className={`${darkMode ? 'text-dark-white' : 'text-light-apricot'}`}>{user.role} {user.is_approved ? '(Approved)' : user.is_rejected ? '(Rejected)' : '(Pending)'}</p>
              <p className="mt-2"><i className="fas fa-envelope mr-2"></i>{user.email}</p>
              <p><i className="fas fa-phone mr-2"></i>{user.phone_number}</p>
            </div>
            <div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-dark-white' : 'text-light-blueberry'}`}>Education</h3>
              <p className={`${darkMode ? 'text-dark-gray-100' : 'text-light-apricot'}`}>{user.tutor_application?.education_qualification}</p>
              
              <h3 className={`text-xl font-semibold mb-2 mt-4 ${darkMode ? 'text-dark-white' : 'text-light-blueberry'}`}>Experience</h3>
              <p className={`${darkMode ? 'text-dark-gray-100' : 'text-light-apricot'}`}>{user.tutor_application?.job_experience}</p>
              {/* <button
                onClick={() => setEditMode(true)}
                className={`mt-4 ${darkMode ? 'bg-dark-gray-100 text-dark-white hover:bg-dark-gray-200' : 'bg-light-citrus text-white hover:bg-light-apricot'} px-4 py-2 rounded transition-colors`}
              >
                Edit Education/Experience
              </button> */}
            
            </div>
          </div>

         
 {/* Form Selection Buttons */}
 <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => setActiveForm('profile')}
              className={`px-4 py-2 rounded transition-colors ${
                activeForm === 'profile'
                  ? darkMode
                    ? 'bg-dark-gray-100 text-dark-white'
                    : 'bg-light-citrus text-white'
                  : darkMode
                  ? 'bg-dark-gray-200 text-dark-white'
                  : 'bg-light-apricot text-white'
              }`}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setActiveForm('password')}
              className={`px-4 py-2 rounded transition-colors ${
                activeForm === 'password'
                  ? darkMode
                    ? 'bg-dark-gray-100 text-dark-white'
                    : 'bg-light-citrus text-white'
                  : darkMode
                  ? 'bg-dark-gray-200 text-dark-white'
                  : 'bg-light-apricot text-white'
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Edit Profile Form */}
          {activeForm === 'profile' && (
            <div className="mt-8">
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-dark-white' : 'text-light-blueberry'}`}>Edit Profile</h3>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  placeholder="Username"
                  className={`w-full p-2 border rounded ${darkMode ? 'bg-dark-gray-100 text-dark-white' : 'bg-white text-light-blueberry'}`}
                />
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder="Email"
                  className={`w-full p-2 border rounded ${darkMode ? 'bg-dark-gray-100 text-dark-white' : 'bg-white text-light-blueberry'}`}
                />
                <input
                  type="tel"
                  name="phone_number"
                  value={profileData.phone_number}
                  onChange={handleProfileChange}
                  placeholder="Phone Number"
                  className={`w-full p-2 border rounded ${darkMode ? 'bg-dark-gray-100 text-dark-white' : 'bg-white text-light-blueberry'}`}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className={`${darkMode ? 'bg-dark-gray-200 text-dark-white hover:bg-dark-gray-300' : 'bg-light-apricot text-white hover:bg-light-citrus'} px-4 py-2 rounded transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`${darkMode ? 'bg-dark-gray-100 text-dark-white hover:bg-dark-gray-200' : 'bg-light-citrus text-white hover:bg-light-apricot'} px-4 py-2 rounded transition-colors`}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Change Password Form */}
          {activeForm === 'password' && (
            <div className="mt-8">
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-dark-white' : 'text-light-blueberry'}`}>Change Password</h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <input type="password"
                 placeholder="Current Password" 
                 name="old_password"
                 value={passwordData.old_password}
                 onChange={handlePasswordChange}
                 className={`w-full p-2 border rounded ${darkMode ? 'bg-dark-gray-100 text-dark-white' : 'bg-white text-light-blueberry'}`} />
                <input
                 type="password"
                 name="new_password"
                 value={passwordData.new_password}
                 onChange={handlePasswordChange}
                 placeholder="New Password" 
                 className={`w-full p-2 border rounded ${darkMode ? 'bg-dark-gray-100 text-dark-white' : 'bg-white text-light-blueberry'}`} />
                <input 
                type="password" 
                name="confirm_new_password"
                value={passwordData.confirm_new_password}
                onChange={handlePasswordChange}
                placeholder="Confirm New Password" 
                className={`w-full p-2 border rounded ${darkMode ? 'bg-dark-gray-100 text-dark-white' : 'bg-white text-light-blueberry'}`} />
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className={`${darkMode ? 'bg-dark-gray-200 text-dark-white hover:bg-dark-gray-300' : 'bg-light-apricot text-white hover:bg-light-citrus'} px-4 py-2 rounded transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    
                    className={`${darkMode ? 'bg-dark-gray-100 text-dark-white hover:bg-dark-gray-200' : 'bg-light-citrus text-white hover:bg-light-apricot'} px-4 py-2 rounded transition-colors`}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
    </TutorLayout>

  );
};

export default TutorHome;


