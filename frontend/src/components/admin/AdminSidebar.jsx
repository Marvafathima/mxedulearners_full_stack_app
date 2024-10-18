
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logoutAdmin } from '../../store/adminAuthSlice';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {  useDispatch, } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminfetchCourseList } from '../../store/adminTutorSlice';
const AdminSidebar = () => {
  const location = useLocation();
  const [revenueOpen, setRevenueOpen] = useState(false);
  const [tutorsOpen, setTutorsOpen] = useState(false);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const handleLogout = () => {
    dispatch(logoutAdmin()).then(() => {
      navigate('/admin/login');
    });
  };
  const handleCoursesClick=()=>{
    dispatch(adminfetchCourseList()).catch(error => {
      console.error("Error occurred while fetching courses:", error);
    });
  }
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    // { name: 'My Profile', path: '/admin/profile', icon: 'user' },
    { name: 'Students', path: '/admin/students', icon: 'users' },
    { 
      name: 'Tutors', 
      path: '/admin/tutors', 
      icon: 'chalkboard-teacher',
      subItems: [
        { name: 'Tutor Requests', path: '/admin/tutors/requests' },
        { name: 'Verified Tutors', path: '/admin/tutorlist' }
      ],
    },
    { name: 'Courses', path: '/admin/courses', icon: 'book' },
    // {
    //   name: 'Revenue',
    //   path: '/admin/revenue',
    //   icon: 'chart-line',
    //   subItems: ['Debited', 'Credited'],
    // },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-admin-secondary text-white w-64 min-h-screen p-4">
      <div className="space-y-4">
        {menuItems.map((item) => (
          <div key={item.name}>
            {item.subItems ? (
              <div>
                <button
                  onClick={() => {
                    if (item.name === 'Tutors') setTutorsOpen(!tutorsOpen);
                    if (item.name === 'Revenue') setRevenueOpen(!revenueOpen);
                   
                  }}
                  className={`flex items-center w-full p-2 rounded ${
                    isActive(item.path) ? 'bg-admin-primary' : 'hover:bg-admin-primary'
                  }`}
                >
                  <i className={`fas fa-${item.icon} mr-2`}></i>
                  {item.name}
                  <svg
                    className={`w-4 h-4 ml-auto ${(item.name === 'Tutors' ? tutorsOpen : revenueOpen) ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {((item.name === 'Tutors' && tutorsOpen) || (item.name === 'Revenue' && revenueOpen)) && (
                  <div className="pl-4 mt-2 space-y-2">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name || subItem}
                        to={subItem.path || `${item.path}/${subItem.toLowerCase()}`}
                        className={`block p-2 rounded ${
                          isActive(subItem.path || `${item.path}/${subItem.toLowerCase()}`)
                            ? 'bg-admin-primary'
                            : 'hover:bg-admin-primary'
                        }`}
                      >
                        {subItem.name || subItem}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path}
                onClick={item.name === 'Courses' ?
                
                handleCoursesClick : null
              } 
                className={`flex items-center p-2 rounded ${
                  isActive(item.path) ? 'bg-admin-primary' : 'hover:bg-admin-primary'
                }`}
              >
                <i className={`fas fa-${item.icon} mr-2`}></i>
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </div>
      <div className="mt-auto pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-2 rounded hover:bg-admin-primary"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;