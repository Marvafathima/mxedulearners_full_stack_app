import React from 'react';
import Navbar from './Navbar';
import ProfileSidebar from './ProfileSidebar';
import { useSelector } from 'react-redux';
import Footer from './Footer';
const Layout = ({ children }) => {
    const {user}=useSelector((state)=>state.auth)
  return (
  
    <div className="min-h-screen flex flex-col ">
      <Navbar user={user}/>
      <div className="flex flex-1 pt-16"> {/* pt-16 to account for Navbar height */}
        <ProfileSidebar />
        <main className="flex-1 ml-64 p-4 overflow-y-auto"> {/* ml-64 to account for Sidebar width */}
          {children}
        </main>
      
      </div>
    <Footer/>
    </div>
    
  );
};

export default Layout;
