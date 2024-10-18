import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, Typography, Button, Card, CardContent, CardMedia, 
  Modal, TextField, Snackbar, Alert
} from '@mui/material';
import TutorSidebar from './TutorSidebar';
import TutorNavbar from './TutorNavbar';
import { editEducation, addEducation } from '../../store/authSlice'; // Assume these action creators exist

import { getFullImageUrl } from '../ProfileImage';
const EducationDetailsPage = () => {
  const {tutor_application} = useSelector((state) => state.auth.user);
  const {user}=useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [addFormData, setAddFormData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });


  const handleEditOpen = () => {
    setEditFormData({
      education_qualification: tutor_application.education_qualification,
      job_experience: tutor_application.job_experience,
      certificate: null,
      experience_proof: null
    });
    setEditModalOpen(true);
  };

  const handleAddOpen = () => {
    setAddFormData({
      education_qualification: '',
      job_experience: '',
      certificate: null,
      experience_proof: null
    });
    setAddModalOpen(true);
  };

  const handleEditClose = () => setEditModalOpen(false);
  const handleAddClose = () => setAddModalOpen(false);

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleAddChange = (e) => {
    const { name, value, files } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in editFormData) {
        if (editFormData[key] !== null) {
          formData.append(key, editFormData[key]);
        }
      }
      
      await dispatch(editEducation({formData,tutorId:tutor_application.id})).unwrap();
      setSnackbar({ open: true, message: 'Education details updated successfully', severity: 'success' });
      handleEditClose();
    } catch (error) {
        
      setSnackbar({ open: true, message: 'Failed to update education details', severity: 'error' });
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      for (const key in addFormData) {
        if (addFormData[key] !== null) {
          formData.append(key, addFormData[key]);
        }
      }
      await dispatch(addEducation(formData)).unwrap();
      setSnackbar({ open: true, message: 'New education details added successfully', severity: 'success' });
      handleAddClose();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add new education details', severity: 'error' });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box className="flex h-screen bg-gray-100">
      <TutorSidebar user={user} />
      <Box className="flex flex-col flex-grow">
        <TutorNavbar user={user}/>
        <Box className="p-6 overflow-auto">
          <Typography variant="h4" className="mb-6 text-gray-800">
            Education Details
          </Typography>
          
          <Card className="mb-6">
            <CardContent>
              <Typography variant="h6" className="mb-2">
                Education Qualification
              </Typography>
              <Typography variant="body1" className="mb-4">
                {tutor_application.education_qualification}
              </Typography>
              
              <Typography variant="h6" className="mb-2">
                Job Experience
              </Typography>
              <Typography variant="body1" className="mb-4">
                {tutor_application.job_experience || 'No experience provided'}
              </Typography>
              
              <Typography variant="h6" className="mb-2">
                Approval Status
              </Typography>
              <Typography 
                variant="body1" 
                className={`font-semibold ${user.is_approved ? 'text-green-600' : 'text-red-600'}`}
              >
                {user.is_approved ? 'Approved' : 'Not Approved'}
              </Typography>
            </CardContent>
          </Card>
          
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={getFullImageUrl(tutor_application.certificate)}
                alt="Certificate"
                className="object-cover h-48"
              />
              <CardContent>
                <Typography variant="h6">Certificate</Typography>
              </CardContent>
            </Card>
            
            {tutor_application.experience_proof && (
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={getFullImageUrl(tutor_application.experience_proof)}
                  alt="Experience Proof"
                  className="object-cover h-48"
                />
                <CardContent>
                  <Typography variant="h6">Experience Proof</Typography>
                </CardContent>
              </Card>
            )}
          </Box>
          
         

          <Box className="flex justify-end space-x-4 mt-6">
            <Button 
              variant="contained" 
              color="primary"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleEditOpen}
            >
              Edit Details
            </Button>
            {/* <Button 
              variant="contained" 
              color="secondary"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleAddOpen}
            >
              Add New Education
            </Button> */}
          </Box>

          {/* Edit Modal */}
          <Modal open={editModalOpen} onClose={handleEditClose}>
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white p-6 rounded-md shadow-lg">
              <Typography variant="h6" className="mb-4">Edit Education Details</Typography>
              <form onSubmit={handleEditSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Education Qualification"
                  name="education_qualification"
                  value={editFormData.education_qualification || ''}
                  onChange={handleEditChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Job Experience"
                  name="job_experience"
                  value={editFormData.job_experience || ''}
                  onChange={handleEditChange}
                />
                <input
                  type="file"
                  name="certificate"
                  onChange={handleEditChange}
                  className="my-2"
                />
                <input
                  type="file"
                  name="experience_proof"
                  onChange={handleEditChange}
                  className="my-2"
                />
                <Button type="submit" variant="contained" color="primary" className="mt-4">
                  Update
                </Button>
              </form>
            </Box>
          </Modal>

          {/* Add Modal */}
          <Modal open={addModalOpen} onClose={handleAddClose}>
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white p-6 rounded-md shadow-lg">
              <Typography variant="h6" className="mb-4">Add New Education</Typography>
              <form onSubmit={handleAddSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Education Qualification"
                  name="education_qualification"
                  value={addFormData.education_qualification || ''}
                  onChange={handleAddChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Job Experience"
                  name="job_experience"
                  value={addFormData.job_experience || ''}
                  onChange={handleAddChange}
                />
                <input
                  type="file"
                  name="certificate"
                  onChange={handleAddChange}
                  className="my-2"
                />
                <input
                  type="file"
                  name="experience_proof"
                  onChange={handleAddChange}
                  className="my-2"
                />
                <Button type="submit" variant="contained" color="secondary" className="mt-4">
                  Add
                </Button>
              </form>
            </Box>
          </Modal>

          {/* Snackbar for notifications */}
          <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>




        </Box>
      </Box>
    </Box>
  );
};

export default EducationDetailsPage;