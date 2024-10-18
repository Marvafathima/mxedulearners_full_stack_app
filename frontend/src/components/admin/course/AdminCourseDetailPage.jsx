import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar
} from '@mui/material';
import AdminNavbar from '../AdminNavbar';
import AdminSidebar from '../AdminSidebar';
import { getFullImageUrl } from '@/components/ProfileImage';
import { adminAxiosInstance as axios} from '../../../api/axios';
const AdminCourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    // Fetch the course details based on the courseId using Axios
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`/admintutor/courses/${courseId}/`);
        setCourse(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (!course) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h4">Loading...</Typography>
      </Box>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <AdminNavbar />
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6 text-black">
          <div className="container mx-auto">
            <Box mb={4}>
              <Typography variant="h4">{course.name}</Typography>
              <Box display="flex" alignItems="center" mt={2}>
                <Avatar src={getFullImageUrl(course.user.profile_pic)} alt={course.user.username} />
                <Typography variant="subtitle1" ml={2}>
                  Created by {course.user.username}
                </Typography>
              </Box>
            </Box>

            <Box mb={4}>
              <Typography variant="h5">Description</Typography>
              <Typography variant="body1">{course.description}</Typography>
            </Box>

            <Box>
              <Typography variant="h5">Lessons</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Thumbnail</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {course.lessons.map((lesson) => (
                      <TableRow key={lesson.id}>
                        <TableCell>
                          <Box
                            component="img"
                            src={getFullImageUrl(lesson.thumbnail)}
                            alt={lesson.title}
                            sx={{ maxWidth: '80px' }}
                          />
                        </TableCell>
                        <TableCell>{lesson.title}</TableCell>
                        <TableCell>{lesson.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCourseDetailPage;