// src/components/Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-dark-gray-300 text-dark-gray-200 p-6 rounded-lg shadow-xl max-w-md w-full">
        <button onClick={onClose} className="float-right text-gray-500 hover:text-gray-700">x</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;