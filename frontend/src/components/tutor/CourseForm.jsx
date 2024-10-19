
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { addCourse } from '../../store/courseSlice';
import LessonForm from './LessonForm';
import TutorSidebar from './TutorSidebar';
import TutorLayout from './TutorLayout';
import { toast } from 'react-toastify';
import { 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Typography, 
  Skeleton,
  Snackbar,
  Alert,
 
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const CourseForm = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const [lessons, setLessons] = useState([]);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [courseData, setCourseData] = useState({
    name: '',
    category: '',
    price: '',
    offer_percentage: '',
    description: '',
    thumbnail: null,
    points: 0
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setCourseData(prev => ({ ...prev, [name]: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setCourseData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addLesson = (lessonFormData) => {
    setLessons(prev => [...prev, lessonFormData]);
    setShowLessonForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();

      Object.keys(courseData).forEach(key => {
        if (key === 'thumbnail' && courseData[key] instanceof File) {
          formData.append('thumbnail_file', courseData[key]);
        } else {
          formData.append(key, courseData[key]);
        }
      });

      formData.append('user', user.id);

      lessons.forEach((lessonFormData, index) => {
        for (let [key, value] of lessonFormData.entries()) {
          formData.append(`lessons[${index}][${key}]`, value);
        }
      });

      await dispatch(addCourse(formData)).unwrap();
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/tutor/courses');
      }, 2000);
    } catch (error) {
      console.error("Failure:", error);
      toast.error(`${error}`)
      // Handle error (you might want to set an error state and display it)
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', marginTop: 2 }}>
        <Skeleton variant="rectangular" width="100%" height={118} />
        <Skeleton width="60%" />
        <Skeleton width="80%" />
        <Skeleton width="40%" />
      </Box>
    );
  }

  return (
    <TutorLayout user={user}>
    <div className={`flex ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-black'}`}>
      <div className={`fixed h-screen ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        {/* <TutorSidebar user={user} /> */}
      </div>
      <div className={`flex-grow ml-64 p-6 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <Box sx={{ maxWidth: '800px', margin: 'auto' }}>
          <Typography variant="h4" gutterBottom>
            Create New Course
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Course Name"
              name="name"
              value={courseData.name}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                className: `${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`
              }}
              InputLabelProps={{
                className: `${darkMode ? 'text-gray-300' : 'text-gray-700'}`
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Category</InputLabel>
              <Select
                name="category"
                value={courseData.category}
                onChange={handleChange}
                required
                className={`${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
              >
               
                <MenuItem value="Frontend">Frontend</MenuItem>
                <MenuItem value="Backend">Backend</MenuItem>
                <MenuItem value="Full Stack Development">Full Stack Development</MenuItem>
                <MenuItem value="Data Science">Data Science</MenuItem>
                <MenuItem value="Machine Learning">Machine Learning</MenuItem>
                <MenuItem value="Cybersecurity">Cybersecurity</MenuItem>
                <MenuItem value="Mobile App Development">Mobile App Development</MenuItem>
               
               
              </Select>
  
            </FormControl>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={courseData.price}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                className: `${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`
              }}
            />
            <TextField
              fullWidth
              label="Offer Percentage"
              name="offer_percentage"
              type="number"
              value={courseData.offer_percentage}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                className: `${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`
              }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={courseData.description}
              onChange={handleChange}
              margin="normal"
              required
              InputProps={{
                className: `${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`
              }}
            />
            <input
              type="file"
              name="thumbnail"
              onChange={handleChange}
              accept="image/*"
              style={{ display: 'none' }}
              id="thumbnail-upload"
            />
            <label htmlFor="thumbnail-upload">
              <Button variant="contained" component="span">
                Upload Thumbnail
              </Button>
            </label>
            {previewImage && (
              <img src={previewImage} alt="Thumbnail preview" style={{ maxWidth: '200px', marginTop: '10px' }} />
            )}
            <TextField
              fullWidth
              label="Course Points"
              name="points"
              type="number"
              value={courseData.points}
              onChange={handleChange}
              margin="normal"
              InputProps={{
                className: `${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`
              }}
            />
            <Button
              variant="contained"
              onClick={() => setShowLessonForm(true)}
              sx={{ marginTop: 2 }}
            >
              Add Lesson
            </Button>
            {lessons.length > 0 && (
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="h6">Lessons Added: {lessons.length}</Typography>
                <ul>
                  {lessons.map((lesson, index) => (
                    <li key={index}>{lesson.get('title')}</li>
                  ))}
                </ul>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate('/tutor/courses')}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={isLoading}
              >
                Save and Preview
              </LoadingButton>
            </Box>
          </form>
          {showLessonForm && (
            <LessonForm
              onSave={addLesson}
              onCancel={() => setShowLessonForm(false)}
              lessonNumber={lessons.length + 1}
            />
          )}
        </Box>
      </div>
      <Snackbar open={isSuccess} autoHideDuration={2000}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Course created successfully!
        </Alert>
      </Snackbar>
    </div></TutorLayout>
  );
};

export default CourseForm;