
// import React, { useContext, useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { ThemeContext } from '../../../contexts/ThemeContext';
// import {
//   HomeIcon, UserCircleIcon, PencilIcon, UserGroupIcon, 
//   AcademicCapIcon, BeakerIcon, ChatBubbleLeftRightIcon, 
//   ShoppingCartIcon, HeartIcon, ChevronDownIcon
// } from '@heroicons/react/24/outline';
// import Footer from './Footer';
// const SidebarButton = ({ icon, label, to, children }) => {
//   const location = useLocation();
//   const [isOpen, setIsOpen] = useState(false);
//   const isActive = location.pathname.startsWith(to);
//   const { darkMode } = useContext(ThemeContext);

//   const baseClasses = "flex items-center w-full p-3 mb-2 rounded-lg transition-colors duration-200";
//   const activeClasses = darkMode 
//     ? "bg-dark-white text-dark-gray-300" 
//     : "bg-light-applecore text-light-blueberry";
//   const inactiveClasses = darkMode
//     ? "text-dark-white hover:bg-dark-gray-200"
//     : "text-light-applecore hover:bg-light-apricot";

//   return (
//     <div>
//       <button 
//         onClick={() => children && setIsOpen(!isOpen)} 
//         className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
//       >
//         {icon}
//         <span className="ml-3 flex-grow text-left">{label}</span>
//         {children && <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />}
//       </button>
//       {isOpen && children && (
//         <div className="ml-6 mt-1">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };

// const SubMenuItem = ({ label, to }) => {
//   const { darkMode } = useContext(ThemeContext);
//   const textColor = darkMode ? "text-dark-lightblue" : "text-light-applecore";
//   return (
//     <Link to={to} className={`block py-2 px-4 ${textColor} hover:underline`}>
//       {label}
//     </Link>
//   );
// };

// const ProfileSidebar = () => {
//   const { darkMode } = useContext(ThemeContext);
//   const bgColor = darkMode ? "bg-dark-gray-100" : "bg-light-blueberry";

//   return (
    
//     <div className={`w-64  ${bgColor} p-4 fixed top-0 left-0 overflow-y-auto`}>
//       <SidebarButton icon={<HomeIcon className="w-6 h-6" />} label="Dashboard" to="/student/profile" />
//       <SidebarButton icon={<UserCircleIcon className="w-6 h-6" />} label="My Profile" to="/student/profile">
//         <SubMenuItem label="View Profile" to="/student/profile" />
//         {/* <SubMenuItem label="Edit Profile" to="/profile/edit" /> */}
//       </SidebarButton>
//       <SidebarButton icon={<AcademicCapIcon className="w-6 h-6" />} label="My Courses" to="/courses">
//         <SubMenuItem label="View Courses" to="/my_courses" />
//         <SubMenuItem label="View Progress" to="/courses/progress" />
//       </SidebarButton>
//       <SidebarButton icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} label="Chat" to="/chat">
//         {/* <SubMenuItem label="Chat Requests" to="/chat/requests" /> */}
//         <SubMenuItem label="View Chats" to="/student/chat" />
//         {/* <SubMenuItem label="Pending Requests" to="/chat/pending" /> */}
//       </SidebarButton>
    
//       <SidebarButton icon={<ShoppingCartIcon className="w-6 h-6" />} label="Cart" to='/cart' >
//       <SubMenuItem label="View Cart" to="/cart" />
//       </SidebarButton>
     
//     </div>
   
  
//   );
// };

// export default ProfileSidebar;
import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../../contexts/ThemeContext';
import {
  HomeIcon, UserCircleIcon, AcademicCapIcon,
  ChatBubbleLeftRightIcon, ShoppingCartIcon,
  ChevronDownIcon, MenuIcon, XIcon
} from '@heroicons/react/24/outline';

const SidebarButton = ({ icon: Icon, label, to, children }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = location.pathname.startsWith(to);
  const { darkMode } = useContext(ThemeContext);

  const baseClasses = "flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200";
  const activeClasses = darkMode
    ? "bg-dark-white/10 text-white font-medium"
    : "bg-light-blueberry/10 text-light-blueberry font-medium";
  const inactiveClasses = darkMode
    ? "text-gray-300 hover:bg-dark-white/5 hover:text-white"
    : "text-gray-600 hover:bg-light-blueberry/5 hover:text-light-blueberry";

  return (
    <div className="relative">
      <button
        onClick={() => children && setIsOpen(!isOpen)}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} group`}
      >
        <Icon className="w-5 h-5" />
        <span className="ml-3 flex-grow text-left text-sm">{label}</span>
        {children && (
          <ChevronDownIcon 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </button>
      {children && (
        <div 
          className={`overflow-hidden transition-all duration-200 ${
            isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="ml-6 mt-1 space-y-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const SubMenuItem = ({ label, to }) => {
  const { darkMode } = useContext(ThemeContext);
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`block py-2 px-4 rounded-md text-sm transition-colors duration-200 ${
        darkMode
          ? `${isActive ? 'text-white bg-dark-white/10' : 'text-gray-400 hover:text-white hover:bg-dark-white/5'}`
          : `${isActive ? 'text-light-blueberry bg-light-blueberry/10' : 'text-gray-500 hover:text-light-blueberry hover:bg-light-blueberry/5'}`
      }`}
    >
      {label}
    </Link>
  );
};

const ProfileSidebar = () => {
  const { darkMode } = useContext(ThemeContext);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const sidebarBg = darkMode ? "bg-dark-gray-100" : "bg-white";
  const borderColor = darkMode ? "border-dark-gray-200" : "border-gray-200";

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-light-blueberry/10 hover:bg-light-blueberry/20 transition-colors duration-200"
      >
        {isMobileOpen ? (
          <XIcon className="w-6 h-6 text-light-blueberry" />
        ) : (
          <MenuIcon className="w-6 h-6 text-light-blueberry" />
        )}
      </button>

      {/* Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 w-64 transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${sidebarBg} border-r ${borderColor} shadow-lg`}
      >
        {/* Logo Area */}
        <div className="p-4 border-b border-gray-200">
          <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-light-blueberry'}`}>
            MXEduLearners
          </h1>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <SidebarButton icon={HomeIcon} label="Dashboard" to="/student/profile" />
          
          <SidebarButton icon={UserCircleIcon} label="My Profile" to="/student/profile">
            <SubMenuItem label="View Profile" to="/student/profile" />
          </SidebarButton>
          
          <SidebarButton icon={AcademicCapIcon} label="My Courses" to="/courses">
            <SubMenuItem label="View Courses" to="/my_courses" />
            <SubMenuItem label="View Progress" to="/courses/progress" />
          </SidebarButton>
          
          <SidebarButton icon={ChatBubbleLeftRightIcon} label="Chat" to="/chat">
            <SubMenuItem label="View Chats" to="/student/chat" />
          </SidebarButton>
          
          <SidebarButton icon={ShoppingCartIcon} label="Cart" to="/cart">
            <SubMenuItem label="View Cart" to="/cart" />
          </SidebarButton>
        </nav>

        {/* User Profile Section */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${borderColor}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-light-blueberry/20 flex items-center justify-center">
              <UserCircleIcon className="w-6 h-6 text-light-blueberry" />
            </div>
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Student Name
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                student@email.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSidebar;