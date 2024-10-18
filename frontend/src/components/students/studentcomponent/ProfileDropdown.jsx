// src/components/student/ProfileDropdown.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { useDispatch } from 'react-redux';

import { logoutUser } from '../../../store/authSlice';
import { ThemeContext } from '../../../contexts/ThemeContext'

const ProfileDropdown = ({ user }) => {
  const { darkMode } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
        {user.profile_pic ? (
          <img src={user.profile_pic} alt={user.username} className="w-full h-full rounded-full" />
        ) : (
          <span>{user.username[0].toUpperCase()}</span>
        )}
      </Menu.Button>

      <Menu.Items className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
        darkMode 
          ? 'bg-dark-gray-200 text-dark-white' 
          : 'bg-white text-gray-700'
      }`}>
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <Link
                to="/student/profile"
                className={`block px-4 py-2 text-sm ${
                  active
                    ? darkMode 
                      ? 'bg-dark-gray-100 text-dark-white' 
                      : 'bg-gray-100 text-gray-900'
                    : darkMode
                      ? 'text-dark-white'
                      : 'text-gray-700'
                }`}
              >
                My Profile
              </Link>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  active
                    ? darkMode 
                      ? 'bg-dark-gray-100 text-dark-white' 
                      : 'bg-gray-100 text-gray-900'
                    : darkMode
                      ? 'text-dark-white'
                      : 'text-gray-700'
                }`}
              >
                Logout
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default ProfileDropdown;
