// import React from 'react';
// import { useSelector } from 'react-redux';
// import { DataGrid } from '@mui/x-data-grid';
// import { Card, CardContent, Typography, Avatar } from '@mui/material';
// import { School, AssignmentTurnedIn, EmojiEvents } from '@mui/icons-material';
// import AdminNavbar from '../AdminNavbar';
// import AdminSidebar from '../AdminSidebar';

// export const TutorDetailPage = () => {


// const {currentTutor}=useSelector(state=>state.tutors)
// if (!currentTutor){
//     return(
//         <div>
//             Loading.....
//         </div>
//     )
// }
// const totalCourses = currentTutor.mycourses?.length
// const totalPurchases=20;
// const rating=4.5
// //   const totalQuizAttempts = currentStudent.quiz_attempts?.length;
// //   const totalCertificates = currentStudent.course_certificates?.length;

//   const columns = [
//     { field: 'name', headerName: 'Course Name', width: 200 },
//     { field: 'created at', headerName: 'Created At', width: 150 },
//     { field: 'total_purchases', headerName: 'Total Purchase', width: 150 },
//  ,
//   ];

//   const rows = currentTutor.mycourses.map((pcourse, index) => ({
//     id: index,
//     name: pcourse.course.name,
//     creator: pcourse.course.user.username, // Assuming the creator's username is stored in the user field
//     // purchasedDate: pcourse.order.order_date, // Assuming created_at is the purchase date
//     // isComplete: pcourse.is_complete // Assuming there's an is_completed field
//   }));

//   return (
//     <div className="flex-1 flex flex-col overflow-hidden">
//       <AdminNavbar />
//       <div className="flex h-screen bg-gray-100">
//         <AdminSidebar />
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
//           <div className="max-w-6xl mx-auto">
//             {/* User Statistics */}
//             <div className="grid grid-cols-3 gap-4 mb-6">
//               <Card className="bg-white shadow-md">
//                 <CardContent className="flex items-center space-x-4">
//                   <School className="text-blue-500" />
//                   <div>
//                     <Typography variant="h6">Total Courses</Typography>
//                     <Typography variant="h4">{totalCourses}</Typography>
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="bg-white shadow-md">
//                 <CardContent className="flex items-center space-x-4">
//                   <AssignmentTurnedIn className="text-green-500" />
//                   <div>
//                     <Typography variant="h6">Total Purchases</Typography>
//                     <Typography variant="h4">{totalPurchases}</Typography>
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="bg-white shadow-md">
//                 <CardContent className="flex items-center space-x-4">
//                   <EmojiEvents className="text-yellow-500" />
//                   <div>
//                     <Typography variant="h6">Rating</Typography>
//                     <Typography variant="h4">{rating}</Typography>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* User Profile */}
//             <Card className="bg-white shadow-md mb-6">
//               <CardContent className="flex items-center space-x-4">
//                 <Avatar src={currentTutor.profile_pic} className="w-20 h-20">
//                   {!currentTutor.profile_pic && currentTutor.username.charAt(0)}
//                 </Avatar>
//                 <div>
//                   <Typography variant="h5">{currentTutor.username}</Typography>
//                   <Typography variant="body1">{currentTutor.phone_number}</Typography>
//                   <Typography variant="body1">{currentTutor.email}</Typography>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* User Courses */}
//             <Card className="bg-white shadow-md">
//               <CardContent>
//                 <Typography variant="h6" className="mb-4">Courses</Typography>
//                 <div style={{ height: 400, width: '100%' }}>
//                   <DataGrid
//                     rows={rows}
//                     columns={columns}
//                     pageSize={5}
//                     rowsPerPageOptions={[5]}
//                     disableSelectionOnClick
//                     sx={{
//                       '& .MuiDataGrid-cell:hover': {
//                         color: 'primary.main',
//                       },
//                       '& .MuiDataGrid-columnHeaders': {
//                         backgroundColor: 'rgba(0, 0, 0, 0.04)',
//                         color: 'rgba(0, 0, 0, 0.87)',
//                         fontSize: 16,
//                       },
//                     }}
//                   />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };
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