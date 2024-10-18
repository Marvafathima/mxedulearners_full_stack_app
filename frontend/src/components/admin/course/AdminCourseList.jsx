import React from 'react'
import { adminfetchCourseList } from '../../../store/adminTutorSlice'
import { useSelector } from 'react-redux'
import { useState } from 'react';
import AdminSidebar from '../AdminSidebar';
import AdminNavbar from '../AdminNavbar';
import { 
    Box, 
    CircularProgress,
    Button 
  } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';


export const AdminCourseList = () => {


    const {courseList,error,status}=useSelector(state=>state.tutors)
    const navigate=useNavigate();
    const rows = courseList.map(course => ({
        id: course.id,
        name: course.name,
        totalLessons: course.lessons?.length || 0,
        creatorName: course.user?.username || 'N/A',
        price: course.price ? `₹${course.price}` : 'N/A'
    }));
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 300 },
        { field: 'totalLessons', headerName: 'Total Lessons', width: 130 },
        { field: 'creatorName', headerName: 'Creator Name', width: 200 },
        { field: 'price', headerName: 'Price', width: 100 },
        { 
        field: 'actions', 
        headerName: 'Actions', 
        width: 120,
        renderCell: (params) => (
            <Button 
            variant="outlined" 
            size="small"
            onClick={() => handleViewDetails(params.id)}
            >
            View Details
            </Button>
        ),
        },
    ];

    const handleViewDetails = (id) => {
        navigate(`/admin/courses/course_detail/${id}`)
        console.log(`View details for course ${id}`);
    };
    if (!courseList || courseList.length === 0) {
        return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
        );
    }
    return (
        <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <div className="flex h-screen bg-gray-100">
            <AdminSidebar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
            <div className="container mx-auto">
                <h1 className="text-2xl font-semibold mb-4">Course List</h1>
                <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    checkboxSelection
                    disableSelectionOnClick
                    components={{
                    Toolbar: GridToolbar,
                    }}
                />
                </Box>
            </div>
            
            </main>
        </div>
        </div>
    );
    };





