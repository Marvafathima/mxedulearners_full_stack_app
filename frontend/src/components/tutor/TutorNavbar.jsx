import React, { useContext,useEffect } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { addNotification ,addMessage, removeNotification, clearAllNotifications } from '../../store/tutorChatSlice';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Popover } from '@headlessui/react';
import { ChevronDownIcon, BellIcon } from '@heroicons/react/20/solid';
import CloseIcon from '@mui/icons-material/Close';

const TutorNavbar = ({ user }) => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { socket } = useWebSocket();
  const notifications = useSelector((state) => state.chats.notifications);
  
  const handleLogout = () => {
    // Implement logout functionality here
    // For example: clear local storage, reset auth state, etc.
    // Then navigate to login page
  
  };
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
      console.log("notification clicked")
      navigate(`/tutor/chat?sender_id=${notif.sender_id}`);
    }
    // Handle other notification types here if needed
  };


  return (
     
    <nav className={`${darkMode ? 'bg-dark-gray-200' : 'bg-light-blueberry'} p-4`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-white">MXEduLearners</div>
         {/* Notification Icon and Popover */}
         <div className="flex items-center space-x-4">
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
          
        <div className="flex items-center space-x-4 ">
          <div className="relative group">
          {user.profile_pic ? ( 
            <img
              src={user.profile_pic || '/path/to/default/image.png'}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
            />):(
              <span>{user.username[0].toUpperCase()}</span>
            )}
            <div className={`absolute right-0 mt-2 w-48 ${
              darkMode ? 'bg-dark-gray-100' : 'bg-white'
            } rounded-md shadow-lg py-1 z-10 hidden group-hover:block`}>
              <button
                onClick={() => navigate('/tutor/profile')}
                className={`block px-4 py-2 text-sm ${
                  darkMode ? 'text-dark-white hover:bg-dark-gray-200' : 'text-gray-700 hover:bg-gray-100'
                } w-full text-left`}
              >
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className={`block px-4 py-2 text-sm ${
                  darkMode ? 'text-dark-white hover:bg-dark-gray-200' : 'text-gray-700 hover:bg-gray-100'
                } w-full text-left`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        </div>
        </div>
    </nav>
  );
};

export default TutorNavbar;