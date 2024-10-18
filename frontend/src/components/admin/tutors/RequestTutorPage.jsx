

import React from 'react';
import AdminNavbar from '../AdminNavbar';
import AdminSidebar from '../AdminSidebar';

import TutorRequestList from './TutorRequestList';
import '@fortawesome/fontawesome-free/css/all.min.css';
const RequestTutorPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-gray-700 text-3xl font-medium">Tutors request</h3>
           < TutorRequestList/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestTutorPage;