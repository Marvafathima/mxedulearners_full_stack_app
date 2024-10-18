
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Avatar, Button,Chip } from '@mui/material';
import { adminAxiosInstance as axios } from '../../../api/axios';
import AdminSidebar from '../AdminSidebar';
import AdminNavbar from '../AdminNavbar';
import Swal from 'sweetalert2'; 
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminfetchTutorDetail } from '../../../store/adminTutorSlice';
const TutorList = () => {
  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const response = await axios.get('/admintutor/approved-tutors/');
      setTutors(response.data);
    } catch (error) {
      console.error('Error fetching tutors:', error);
    }
  };
  const handleBlockUnblock = async (id, currentStatus) => {
    const action = currentStatus ? 'block' : 'unblock';
    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this tutor?`,
      text: `This will ${action} the tutor's account.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: currentStatus ? '#d33' : '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action} it!`
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.patch(`/admintutor/tutors/${id}/toggle-active/`);
        setTutors(tutors.map(tutor => 
          tutor.id === id ? { ...tutor, is_active: response.data.is_active } : tutor
        ));
        Swal.fire(
          `Tutor ${action}ed!`,
          `The tutor has been ${action}ed successfully.`,
          'success'
        );
      } catch (error) {
        console.error(`Error ${action}ing tutor:`, error);
        Swal.fire(
          'Error',
          `Failed to ${action} the tutor. Please try again.`,
          'error'
        );
      }
    }
  };
const dispatch=useDispatch();
const navigate=useNavigate();
  const handleViewDetails = async (id) => {
    try {
      const resp=await dispatch(adminfetchTutorDetail(id))
      console.log(resp)
      navigate('/admin/tutor-detail');
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
            onClick={() => handleViewDetails(params.row.id)}
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
            <h1 className="text-2xl font-semibold mb-4">Verified Tutors</h1>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={tutors}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                sx={{
                  '& .MuiDataGrid-root': {
                    border: 'none',
                  },
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f0f0f0',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#4a5568',
                    color: 'white',
                    borderBottom: 'none',
                  },
                  '& .MuiDataGrid-virtualScroller': {
                    backgroundColor: '#f9fafb',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: 'none',
                    backgroundColor: '#f9fafb',
                  },
                  '& .MuiCheckbox-root': {
                    color: '#4a5568',
                  },
                  '& .MuiDataGrid-row': {
                    '&:nth-of-type(even)': {
                      backgroundColor: '#f3f4f6',
                    },
                  },
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TutorList;