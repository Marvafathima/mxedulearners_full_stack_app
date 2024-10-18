// StudentList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Button, Chip } from '@mui/material';
import AdminSidebar from '../AdminSidebar';
import AdminNavbar from '../AdminNavbar';
import Swal from 'sweetalert2';
import { fetchAllStudents, toggleStudentActive,adminfetchStudentDetail } from '../../../store/adminStudentSlice'
import { useNavigate } from 'react-router-dom';

const StudentList = () => {
  const dispatch = useDispatch();
  const { students, status } = useSelector((state) => state.students);
  const navigate=useNavigate();
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAllStudents());
    }
  }, [status, dispatch]);

  const handleBlockUnblock = async (id, currentStatus) => {
    const action = currentStatus ? 'block' : 'unblock';
    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this student?`,
      text: `This will ${action} the student's account.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: currentStatus ? '#d33' : '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action} it!`
    });

    if (result.isConfirmed) {
      try {
        await dispatch(toggleStudentActive(id)).unwrap();
        Swal.fire(
          `Student ${action}ed!`,
          `The student has been ${action}ed successfully.`,
          'success'
        );
      } catch (error) {
        console.error(`Error ${action}ing student:`, error);
        Swal.fire(
          'Error',
          `Failed to ${action} the student. Please try again.`,
          'error'
        );
      }
    }
  };
  const handleStudentViewDetails = async (id) => {
    try {
      await dispatch(adminfetchStudentDetail(id));
      navigate('/admin/student-detail');
    } catch (error) {
      console.error("Error fetching student details:", error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };
  const columns = [
    { field: 'id', headerName: 'Serial No.', width: 100 },
    {
      field: 'profile_pic',
      headerName: 'Profile',
      width: 100,
      renderCell: (params) => (
        <Avatar src={params.value} alt={params.row.email} />
      ),
    },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'joined_at',
      headerName: 'Joined At',
      width: 200,
      valueGetter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: 'is_active',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Blocked'}
          color={params.value ? 'success' : 'error'}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <div className="flex space-x-2">
          <Button
            variant="contained"
            size="small"
            color={params.row.is_active ? 'error' : 'primary'}
            onClick={() => handleBlockUnblock(params.row.id, params.row.is_active)}
          >
            {params.row.is_active ? 'Block' : 'Unblock'}
          </Button>
          <Button
            variant="contained"
            size="small"
            color="secondary"
            onClick={() =>handleStudentViewDetails(params.row.id)}
          >
            View Details
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminNavbar />
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold mb-4">All Students</h1>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={students}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                sx={{
                  // ... (same styles as in TutorList)
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentList;