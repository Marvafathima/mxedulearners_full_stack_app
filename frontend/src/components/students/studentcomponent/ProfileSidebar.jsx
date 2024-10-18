
import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../../contexts/ThemeContext';
import {
  HomeIcon, UserCircleIcon, PencilIcon, UserGroupIcon, 
  AcademicCapIcon, BeakerIcon, ChatBubbleLeftRightIcon, 
  ShoppingCartIcon, HeartIcon, ChevronDownIcon
} from '@heroicons/react/24/outline';
import Footer from './Footer';
const SidebarButton = ({ icon, label, to, children }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = location.pathname.startsWith(to);
  const { darkMode } = useContext(ThemeContext);

  const baseClasses = "flex items-center w-full p-3 mb-2 rounded-lg transition-colors duration-200";
  const activeClasses = darkMode 
    ? "bg-dark-white text-dark-gray-300" 
    : "bg-light-applecore text-light-blueberry";
  const inactiveClasses = darkMode
    ? "text-dark-white hover:bg-dark-gray-200"
    : "text-light-applecore hover:bg-light-apricot";

  return (
    <div>
      <button 
        onClick={() => children && setIsOpen(!isOpen)} 
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        {icon}
        <span className="ml-3 flex-grow text-left">{label}</span>
        {children && <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />}
      </button>
      {isOpen && children && (
        <div className="ml-6 mt-1">
          {children}
        </div>
      )}
    </div>
  );
};

const SubMenuItem = ({ label, to }) => {
  const { darkMode } = useContext(ThemeContext);
  const textColor = darkMode ? "text-dark-lightblue" : "text-light-applecore";
  return (
    <Link to={to} className={`block py-2 px-4 ${textColor} hover:underline`}>
      {label}
    </Link>
  );
};

const ProfileSidebar = () => {
  const { darkMode } = useContext(ThemeContext);
  const bgColor = darkMode ? "bg-dark-gray-100" : "bg-light-blueberry";

  return (
    
    <div className={`w-64  ${bgColor} p-4 fixed top-0 left-0 overflow-y-auto`}>
      <SidebarButton icon={<HomeIcon className="w-6 h-6" />} label="Dashboard" to="/student/profile" />
      <SidebarButton icon={<UserCircleIcon className="w-6 h-6" />} label="My Profile" to="/student/profile">
        <SubMenuItem label="View Profile" to="/student/profile" />
        {/* <SubMenuItem label="Edit Profile" to="/profile/edit" /> */}
      </SidebarButton>
      <SidebarButton icon={<AcademicCapIcon className="w-6 h-6" />} label="My Courses" to="/courses">
        <SubMenuItem label="View Courses" to="/my_courses" />
        <SubMenuItem label="View Progress" to="/courses/progress" />
      </SidebarButton>
      <SidebarButton icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} label="Chat" to="/chat">
        {/* <SubMenuItem label="Chat Requests" to="/chat/requests" /> */}
        <SubMenuItem label="View Chats" to="/student/chat" />
        {/* <SubMenuItem label="Pending Requests" to="/chat/pending" /> */}
      </SidebarButton>
      {/* <SidebarButton icon={<UserGroupIcon className="w-6 h-6" />} label="My Tutors" to="/tutors" />
      <SidebarButton icon={<BeakerIcon className="w-6 h-6" />} label="Quiz" to="/quiz">
        <SubMenuItem label="Attended Quiz" to="/quiz/attended" />
        <SubMenuItem label="Pending Quiz" to="/quiz/pending" />
      </SidebarButton> */}
      <SidebarButton icon={<ShoppingCartIcon className="w-6 h-6" />} label="Cart" to='/cart' >
      <SubMenuItem label="View Cart" to="/cart" />
      </SidebarButton>
      {/* <SidebarButton icon={<HeartIcon className="w-6 h-6" />} label="Wishlist" to="/wishlist" /> */}
    </div>
   
  
  );
};

export default ProfileSidebar;