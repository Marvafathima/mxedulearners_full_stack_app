
import React, { useState, useContext, useRef } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  LinearProgress,
} from '@mui/material';

const LessonForm = ({ onSave, onCancel, lessonNumber, initialData = null }) => {
  const { darkMode } = useContext(ThemeContext);
  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const [lessonData, setLessonData] = useState(initialData || {
    title: '',
    description: '',
    // duration: '',
    video: null,
    thumbnail: null,
    points: 0
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setLessonData(prev => ({ ...prev, [name]: file }));
      if (name === 'thumbnail') {
        setPreviewImage(URL.createObjectURL(file));
      } else if (name === 'video') {
        simulateVideoUpload(file);
      }
    } else {
      setLessonData(prev => ({ ...prev, [name]: value }));
    }
  };

  const simulateVideoUpload = (file) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(lessonData).forEach(key => {
      if (key === 'video' || key === 'thumbnail') {
        if (lessonData[key] instanceof File) {
          formData.append(key, lessonData[key]);
        }
      } else {
        formData.append(key, lessonData[key]);
      }
    });
    formData.append('lesson_number', lessonNumber);
    onSave(formData);
  };

  return (
    <Box sx={{ 
      p: 3, 
      mt: 2, 
      bgcolor: darkMode ? 'grey.800' : 'grey.100', 
      borderRadius: 2 
    }}>
      <Typography variant="h5" gutterBottom>
        {initialData ? `Edit Lesson #${lessonNumber}` : `Add Lesson #${lessonNumber}`}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Lesson Title"
          name="title"
          value={lessonData.title}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={lessonData.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
          required
        />
        {/* <TextField
          fullWidth
          label="Duration (HH:MM:SS)"
          name="duration"
          value={lessonData.duration}
          onChange={handleChange}
          margin="normal"
          placeholder="00:30:00"
          inputProps={{ 
            pattern: "[0-9]{2}:[0-9]{2}:[0-9]{2}",
          }}
          required
        /> */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <input
            type="file"
            name="video"
            onChange={handleChange}
            accept="video/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <Button
            variant="contained"
            component="label"
            onClick={() => fileInputRef.current.click()}
          >
            Upload Video
          </Button>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <Box sx={{ width: '100%', mt: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {uploadProgress}% uploaded
              </Typography>
            </Box>
          )}
          {uploadProgress === 100 && (
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              Upload complete!
            </Typography>
          )}
        </Box>
        <Box sx={{ mt: 2, mb: 2 }}>
          <input
            type="file"
            name="thumbnail"
            onChange={handleChange}
            accept="image/*"
            style={{ display: 'none' }}
            ref={thumbnailInputRef}
          />
          <Button
            variant="contained"
            component="label"
            onClick={() => thumbnailInputRef.current.click()}
          >
            Upload Thumbnail
          </Button>
          {previewImage && (
            <Box sx={{ mt: 2, maxWidth: 200 }}>
              <img src={previewImage} alt="Thumbnail preview" style={{ width: '100%' }} />
            </Box>
          )}
        </Box>
        <TextField
          fullWidth
          label="Lesson Points"
          name="points"
          type="number"
          value={lessonData.points}
          onChange={handleChange}
          margin="normal"
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            {initialData ? 'Update Lesson' : 'Save Lesson'}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default LessonForm;