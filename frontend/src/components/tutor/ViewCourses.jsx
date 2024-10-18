import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeContext } from '../../contexts/ThemeContext';
import { getFullImageUrl } from '../../utils/auth';
import { DataGrid } from '@mui/x-data-grid';
import { fetchCourses } from '../../store/courseSlice';
const ViewCourses = () => {
  const dispatch = useDispatch();
  const { darkMode } = useContext(ThemeContext);
  const { courses, status, error } = useSelector((state) => state.courses);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCourses());
    }
  }, [status, dispatch]);

  const columns = [
    {
      field: 'thumbnail',
      headerName: 'Thumbnail',
      width: 150,
      renderCell: (params) => (
        <img src={getFullImageUrl(params.value)} alt="Course thumbnail" className="w-full h-full object-cover" />
      ),
    },
    {
      field: 'name',
      headerName: 'Course Name',
      width: 200,
      renderCell: (params) => (
        <div>
          <div className="flex justify-between mb-2">
            <button className="bg-blue-500 text-white px-2 py-1 rounded">View</button>
            <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
          </div>
          <div>{params.value}</div>
        </div>
      ),
    },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'price', headerName: 'Price', width: 120 },
    { field: 'offer_percentage', headerName: 'Discount', width: 120 },
    { field: 'points', headerName: 'Points', width: 120 },
    { field: 'rating', headerName: 'Rating', width: 120 },
  ];

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`p-4 ${darkMode ? 'bg-dark-gray-300 text-white' : 'bg-light-applecore text-black'}`}>
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={courses}
          columns={columns}
          pageSize={5}
          checkboxSelection
          disableSelectionOnClick
          className={darkMode ? 'text-white' : 'text-black'}
          getRowId={(row) => row.id} 
        />
      </div>
    </div>
  );
};

export default ViewCourses;