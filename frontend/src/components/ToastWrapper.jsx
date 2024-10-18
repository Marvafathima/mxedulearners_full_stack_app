// src/components/ToastWrapper.jsx
import React, { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import { ThemeContext } from '../contexts/ThemeContext';
import 'react-toastify/dist/ReactToastify.css';

const ToastWrapper = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <ToastContainer theme={darkMode ? 'light' : 'dark'} />
  );
};

export default ToastWrapper;