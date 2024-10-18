
import React from 'react';
import { useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Card, CardContent, Typography, Avatar } from '@mui/material';
import { School, AssignmentTurnedIn, EmojiEvents } from '@mui/icons-material';
import AdminNavbar from '../AdminNavbar';
import AdminSidebar from '../AdminSidebar';

const UserDetailPage = () => {
  const {currentStudent} = useSelector(state => state.students);
  console.log("checking fro currentstudent",currentStudent,"PURCHASEWEEEEE",currentStudent.purchased_courses) 
  if (!currentStudent) {
    return <div>Loading...</div>;
  }

  const totalCoursesPurchased = currentStudent.purchased_courses?.length;
  const totalQuizAttempts = currentStudent.quiz_attempts?.length;
  const totalCertificates = currentStudent.course_certificates?.length;

  const columns = [
    { field: 'name', headerName: 'Course Name', width: 200 },
    { field: 'creator', headerName: 'Creator Name', width: 150 },
    { field: 'purchasedDate', headerName: 'Purchased Date', width: 150 },
    { 
      field: 'isComplete', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <span className={`px-2 py-1 rounded-full text-xs ${params.value ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {params.value ? 'Completed' : 'In Progress'}
        </span>
      ),
    },
  ];

  const rows = currentStudent.purchased_courses.map((pcourse, index) => ({
    id: index,
    name: pcourse.course.name,
    creator: pcourse.course.user.username, // Assuming the creator's username is stored in the user field
    purchasedDate: pcourse.order.order_date, // Assuming created_at is the purchase date
    isComplete: pcourse.is_complete // Assuming there's an is_completed field
  }));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminNavbar />
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <div className="max-w-6xl mx-auto">
            {/* User Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="bg-white shadow-md">
                <CardContent className="flex items-center space-x-4">
                  <School className="text-blue-500" />
                  <div>
                    <Typography variant="h6">Courses Purchased</Typography>
                    <Typography variant="h4">{totalCoursesPurchased}</Typography>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-md">
                <CardContent className="flex items-center space-x-4">
                  <AssignmentTurnedIn className="text-green-500" />
                  <div>
                    <Typography variant="h6">Quizzes Attempted</Typography>
                    <Typography variant="h4">{totalQuizAttempts}</Typography>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-md">
                <CardContent className="flex items-center space-x-4">
                  <EmojiEvents className="text-yellow-500" />
                  <div>
                    <Typography variant="h6">Certificates Earned</Typography>
                    <Typography variant="h4">{totalCertificates}</Typography>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Profile */}
            <Card className="bg-white shadow-md mb-6">
              <CardContent className="flex items-center space-x-4">
                <Avatar src={currentStudent.profile_pic} className="w-20 h-20">
                  {!currentStudent.profile_pic && currentStudent.username.charAt(0)}
                </Avatar>
                <div>
                  <Typography variant="h5">{currentStudent.username}</Typography>
                  <Typography variant="body1">{currentStudent.phone_number}</Typography>
                  <Typography variant="body1">{currentStudent.email}</Typography>
                </div>
              </CardContent>
            </Card>

            {/* User Courses */}
            <Card className="bg-white shadow-md">
              <CardContent>
                <Typography variant="h6" className="mb-4">Purchased Courses</Typography>
                <div style={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    sx={{
                      '& .MuiDataGrid-cell:hover': {
                        color: 'primary.main',
                      },
                      '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        color: 'rgba(0, 0, 0, 0.87)',
                        fontSize: 16,
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDetailPage;