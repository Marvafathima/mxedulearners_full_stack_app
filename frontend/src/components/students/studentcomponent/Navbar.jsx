
import React, { useContext, useState,useEffect } from 'react';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { Menu, Popover } from '@headlessui/react';
import { ChevronDownIcon, BellIcon } from '@heroicons/react/20/solid';
import CloseIcon from '@mui/icons-material/Close';
import ProfileDropdown from './ProfileDropdown';
import { FaShoppingCart } from 'react-icons/fa';
import { addNotification ,addMessage, removeNotification, clearAllNotifications} from '../../../store/tutorChatSlice';
import { useWebSocket } from '../../../contexts/WebSocketContext';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
const categories = [
  'Full Stack Development',
  'Frontend',
  'Backend',
  'Data Science',
  'Machine Learning',
  'Cybersecurity',
  'Mobile App Development'
];

const Navbar = ({user}) => {
  const { darkMode } = useContext(ThemeContext);
  const { count } = useSelector((state) => state.cart);
  const cartcount = JSON.parse(localStorage.getItem('cartCount'));
  const navigate = useNavigate();

  // Mock notifications - replace with actual data in your implementation
  
  const dispatch = useDispatch();
  const { socket } = useWebSocket();
  const notifications = useSelector((state) => state.chats.notifications);
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'notification') {
          dispatch(addNotification(data.notification));
        }
        else if(data.type=='chat_message'){
          console.log("chat message")
          dispatch(addMessage({
            roomName: data.room_name,
            message: {
              id: data.id,
              message: data.message,
              sender_id: data.sender_id,
              receiver_id: data.receiver_id,
              timestamp: data.timestamp,
              message_type: data.message_type,
              file_type: data.file_type
            } }));
        }
      };
    }
  }, [socket, dispatch]);

  const handleClearNotification = (id) => {
    dispatch(removeNotification(id));
  };

  const handleClearAllNotifications = () => {
    dispatch(clearAllNotifications());
  };
  const handleNotificationClick = (notif) => {
    if (notif.notification_type === "chat") {
      navigate(`/student/chat?sender_id=${notif.sender_id}`);
    }
    // Handle other notification types here if needed
  };

  return (
    <nav className={`${darkMode ? 'bg-dark-gray-200' : 'bg-light-blueberry'}  p-4 fixed top-0 left-0 right-0 z-50`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* ... (previous code remains unchanged) ... */}
        <div className="flex items-center space-x-4">
          <Link to="/student-home" className="text-xl font-bold text-white">MXEduLearners</Link>
          
           <Menu as="div" className="relative inline-block text-left">
             <div>
             <Menu.Button className={`inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ${
                darkMode 
                  ? 'bg-dark-gray-100 text-dark-white ring-dark-gray-100 hover:bg-dark-gray-200' 
                  : 'bg-white text-gray-900 ring-gray-300 hover:bg-gray-50'
              }`}>
                Categories
                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </Menu.Button>
            </div>

            <Menu.Items className={`absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
              darkMode 
                ? 'bg-dark-gray-200 text-dark-white' 
                : 'bg-white text-gray-700'
            }`}>
              <div className="py-1">
                {categories.map((category, index) => (
                  <Menu.Item key={index}>
                    {({ active }) => (
                      <Link
                        to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
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
                        {category}
                      </Link>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>

          <input type="search" placeholder="Search for anything" className={`p-2 rounded ${
            darkMode ? 'bg-dark-gray-100 text-dark-white' : 'bg-white text-gray-900'
          }`} />
        </div>






        <div className="flex items-center space-x-4">
          <Link to="/student-home" className={darkMode ? 'text-dark-white' : 'text-white'}>Courses</Link>
          <Link to="/student/chat" className={darkMode ? 'text-dark-white' : 'text-white'}>Chats</Link>
          {/* <Link to="/discussion" className={darkMode ? 'text-dark-white' : 'text-white'}>Discussion</Link> */}
          <Link to="/my_courses" className={darkMode ? 'text-dark-white' : 'text-white'}>My Learning</Link>
          
          <a href="/cart" className="text-white hover:text-gray-100 relative">
            <FaShoppingCart size={24} />
            {cartcount > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-500 text-black rounded-full px-2 py-1 text-xs">
                {cartcount}
              </span>
            )}
          </a>

          {/* Notification Icon and Popover */}
          <Popover className="relative">
            <Popover.Button className="text-white hover:text-gray-100 focus:outline-none">
              <BellIcon className="h-6 w-6" />
              {notifications.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {notifications.length}
                </span>
              )}
            </Popover.Button>

            <Popover.Panel className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <button
                    onClick={handleClearAllNotifications}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <p>No new notifications</p>
                ) : (
                  <ul>
            {notifications.map((notif) => (
              <li 
                key={notif.id} 
                className="flex justify-between items-center py-2 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => handleNotificationClick(notif)}
              >
                <span>{notif.message}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearNotification(notif.id);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
                  // <ul>
                  //   {notifications.map((notif) => (
                  //     <li key={notif.id} className="flex justify-between items-center py-2 border-b">
                  //       <span>{notif.message}</span>
                  //       <button
                  //         onClick={() => handleClearNotification(notif.id)}
                  //         className="text-gray-500 hover:text-gray-700"
                  //       >
                  //         <CloseIcon className="h-4 w-4" />
                  //       </button>
                  //     </li>
                  //   ))}
                  // </ul>
                )}
              </div>
            </Popover.Panel>
          </Popover>

          <ProfileDropdown user={user} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
