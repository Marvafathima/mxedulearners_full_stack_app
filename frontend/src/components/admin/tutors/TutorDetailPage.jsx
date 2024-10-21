
import React from 'react';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import AdminNavbar from '../AdminNavbar';
import AdminSidebar from '../AdminSidebar';
import { getFullImageUrl } from '../../../utils/auth';
import { 
  Box, 
  CircularProgress,
  Button 
} from '@mui/material';
const TutorDetailPage = () => {
  const {currentTutor} = useSelector((state) => state.tutors);
  

 console.log("tutor detail fetched in detial page",currentTutor)
  const columns = [
    { field: 'name', headerName: 'Course Name', width: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'price', headerName: 'Price', width: 100 },
   
  ];
  
 
  
  return (
    <div className="flex flex-col h-screen">
      <AdminNavbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow ">
              <h3 className="font-bold text-lg text-black">Total Courses</h3>
              <p className="text-2xl text-black">{currentTutor.courses.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg text-black">Total Purchases</h3>
              <p className="text-2xl text-black">{currentTutor.total_purchases}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg text-black">Total Enrolled Students</h3>
              <p className="text-2xl text-black">{currentTutor.total_enrolled_students}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold text-lg text-black">Total Sales</h3>
              <p className="text-2xl text-black">${currentTutor.total_sales}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-bold mb-4 text-black">Tutor Details</h2>
            <div className="grid grid-cols-2 gap-4 text-black">
              <div>
                <p><strong>Name:</strong> {currentTutor.username}</p>
                <p><strong>Email:</strong> {currentTutor.email}</p>
                <p><strong>Phone:</strong> {currentTutor.phone_number}</p>
                <p><strong>Joined:</strong> {new Date(currentTutor.joined_at).toLocaleDateString()}</p>
              </div>
              <div>
                <img src={currentTutor.profile_pic} alt="Profile" className="w-32 h-32 rounded-full" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6 text-black">
            <h2 className="text-2xl font-bold mb-4">Education and Qualification</h2>
            <p><strong>Education:</strong> {currentTutor.education.education_qualification}</p>
            <p><strong>Job Experience:</strong> {currentTutor.education.job_experience}</p>
            <div className="mt-4">
           
              <a href={getFullImageUrl(currentTutor.education.certificate)} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-4 py-2 rounded mr-4">View Certificate</a>
              <a href={getFullImageUrl(currentTutor.education.experience_proof)} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-4 py-2 rounded">View Experience Proof</a> 
             
            
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow text-black">
            <h2 className="text-2xl font-bold mb-4">Courses</h2>
       <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={currentTutor.courses}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
       
       
      
           
          </div>
          
        </main>
      </div>
    </div>
  );
};

export default TutorDetailPage;