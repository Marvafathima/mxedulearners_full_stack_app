import React from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';

import { refreshAdminToken } from '../../store/adminAuthSlice';
const AdminDashboard = () => {
 console.log("refreshing")
  const { isAuthenticated, isAdmin,loading } = useSelector((state) => state.adminAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated || !isAdmin) {
        console.log("not authenticated")
        const token = localStorage.getItem('adminToken');
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        try{console.log(isAdmin)} 
        catch{console.log("cannot print")}
        if (!token) {
          navigate('/admin/login');
        } else {
          try {
            await dispatch(refreshAdminToken()).unwrap();
          } catch (error) {
            console.error("Error refreshing token:", error);
            navigate('/admin/login');
          }
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated,isAdmin, navigate, dispatch]);
  // if (isChecking || loading) {
  //   return <div>Loading...</div>;
  // }

  // if (!isAuthenticated || !isAdmin) {
  //   return <Navigate to="/admin/login" />;
  
  // }

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const token = localStorage.getItem('access_token');
     
  //     const isAdmin = localStorage.getItem('isAdmin') === 'true';
     
  //     if (!token || !isAdmin) {
  //       navigate('/admin/login');
  //     } else {
      
  //       try {
         
  //         await dispatch(refreshAdminToken()).unwrap();
  //       } catch (error) {
  //         // If token refresh fails, redirect to login
  //         console.log(error,"error happended in dashboard")
  //         navigate('/admin/login');
  //       }
  //     }
  //   };

  //   checkAuth();
  // }, [navigate, dispatch]);
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>
            {/* Add your dashboard content here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;