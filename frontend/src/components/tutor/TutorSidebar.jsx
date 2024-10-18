import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { getFullImageUrl } from '../../utils/auth';
import {  useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
const TutorSidebar = ({ user }) => {
  const { darkMode } = useContext(ThemeContext);
  const location = useLocation();
  const [coursesOpen, setCoursesOpen] = useState(false);
  const navigate=useNavigate()
  const dispatch=useDispatch()
 
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (itemName) => {
    setOpenItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };


  const sidebarItems = [
    { name: 'My Profile', icon: 'fas fa-tachometer-alt', path: '/tutor-home' },
    { name: 'Education and Qualification', icon: 'fas fa-user', path: '/tutor-education',
    subItems:[
      {name:'View Details',path:'/tutor/education_view'},
      {name:'Add Education',path:'/tutor/add_education'}
    ]
  },
    // { name: 'Students', icon: 'fas fa-users', path: '/tutor/students' },
    {
      name: 'Courses',
      icon: 'fas fa-book',
      path: '/tutor/courses',
      subItems: [
        { name: 'Add New Course', path: '/tutor/create-course' },
        { name: 'View Courses', path: '/tutor/courses' },
      ],
    },
   

    { name: 'Quiz', icon: 'fas fa-calendar-alt', path: '/tutor/quiz',
     subItems:[
      {name:'Create Quiz',path:'/tutor/create-quiz'},
      {name:'View Quizzes',path:'/tutor/quiz_list/'}
     ],
  
  },
    { name: 'Chat', icon: 'fas fa-comments', path: '/tutor/chat' },
    // { name: 'Revenue', icon: 'fas fa-chart-line', path: '/tutor/revenue' },
  ];

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/landing-page');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`w-64 ${darkMode ? 'bg-dark-gray-200' : 'bg-light-blueberry'} text-white p-4 flex flex-col h-screen`}>
      <div className="text-2xl font-bold mb-8">MXEduLearners</div>
      <nav className="flex-grow">
        {/* {sidebarItems.map((item, index) => (
          <div key={index}>
            {item.subItems ? (
              <div>
                <div
                  onClick={() => setCoursesOpen(!coursesOpen)}
                  className={`flex items-center mb-2 cursor-pointer ${
                    darkMode ? 'hover:bg-dark-gray-100' : 'hover:bg-light-apricot'
                  } p-2 rounded ${
                    isActive(item.path) ? (darkMode ? 'bg-dark-gray-100' : 'bg-light-apricot') : ''
                  }`}
                >
                  <i className={`${item.icon} mr-3`}></i>
                  <span>{item.name}</span>
                  <i className={`fas fa-chevron-${coursesOpen ? 'up' : 'down'} ml-auto`}></i>
                </div>
                {coursesOpen && (
                  <div className="ml-6">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.path}
                        className={`flex items-center mb-2 cursor-pointer ${
                          darkMode ? 'hover:bg-dark-gray-100' : 'hover:bg-light-apricot'
                        } p-2 rounded ${
                          isActive(subItem.path) ? (darkMode ? 'bg-dark-gray-100' : 'bg-light-apricot') : ''
                        }`}
                      >
                        <span>{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) :  */}
            {sidebarItems.map((item, index) => (
        <div key={index}>
          {item.subItems ? (
            <div>
              <div
                onClick={() => toggleItem(item.name)}
                className={`flex items-center mb-2 cursor-pointer ${
                  darkMode ? 'hover:bg-dark-gray-100' : 'hover:bg-light-apricot'
                } p-2 rounded ${
                  isActive(item.path) ? (darkMode ? 'bg-dark-gray-100' : 'bg-light-apricot') : ''
                }`}
              >
                <i className={`${item.icon} mr-3`}></i>
                <span>{item.name}</span>
                <i className={`fas fa-chevron-${openItems[item.name] ? 'up' : 'down'} ml-auto`}></i>
              </div>
              {openItems[item.name] && (
                <div className="ml-6">
                  {item.subItems.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      to={subItem.path}
                      className={`flex items-center mb-2 cursor-pointer ${
                        darkMode ? 'hover:bg-dark-gray-100' : 'hover:bg-light-apricot'
                      } p-2 rounded ${
                        isActive(subItem.path) ? (darkMode ? 'bg-dark-gray-100' : 'bg-light-apricot') : ''
                      }`}
                    >
                      <span>{subItem.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) :  (
              <Link
                to={item.path}
                className={`flex items-center mb-4 cursor-pointer ${
                  darkMode ? 'hover:bg-dark-gray-100' : 'hover:bg-light-apricot'
                } p-2 rounded ${
                  isActive(item.path) ? (darkMode ? 'bg-dark-gray-100' : 'bg-light-apricot') : ''
                }`}
              >
                <i className={`${item.icon} mr-3`}></i>
                <span>{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
      <div className="mt-auto">
        <div className="flex items-center mb-4">
        {user.profile_pic ? ( 
          <img
            src={getFullImageUrl(user.profile_pic)}
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />):(
            <span>{user.username[0].toUpperCase()}</span>
          )}
          <span>{user.username}</span>
        </div>
        <button
          onClick={handleLogout}
          className={`w-full ${
            darkMode ? 'bg-dark-gray-100 hover:bg-dark-gray-200' : 'bg-light-apricot hover:bg-light-citrus'
          } p-2 rounded`}
        >
          Logout
        </button>
      



      </div>
    </div>
  );
};

export default TutorSidebar;