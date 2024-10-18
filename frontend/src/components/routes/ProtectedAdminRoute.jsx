


import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { fetchAdminMe } from '../../store/adminAuthSlice';

const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, admin } = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!admin && localStorage.getItem('adminToken')) {
      dispatch(fetchAdminMe());
    }
  }, [dispatch, admin]);

  if (!isAuthenticated && !localStorage.getItem('adminToken')) {
    console.log("currently this is working when redregtpklngkkj")
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;