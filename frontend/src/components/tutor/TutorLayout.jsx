import React from 'react';
import TutorNavbar from './TutorNavbar';
import TutorSidebar from './TutorSidebar';

const TutorLayout = ({ children, user }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <TutorNavbar user={user} />
      <div className="flex flex-grow">
        <TutorSidebar user={user} />
        <main className="flex-grow p-4 overflow-auto">
          {children}
        </main>
      </div>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 MXEduLearners. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default TutorLayout;