import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { userInstance as axios } from '../../../api/axios';
import { useSelector } from 'react-redux';
const QuizSection = ({ courseQuizzes,currentCourse }) => {
  const navigate = useNavigate();
  const {user}=useSelector(state=>state.auth)
console.log(currentCourse?.id)
  const handleStartQuiz = (quizId) => {
    sessionStorage.removeItem('quizSubmitted');
    navigate(`/quiz/${quizId}`);
  };







  const handleViewCertificate = async (courseId, userId) => {
    if (!courseId || !userId) {
      console.error('Course ID or User ID is missing');
      return;
    }
  
    try {
      const response = await axios.get(`/quizmanagement/generate-certificate/${userId}/${courseId}/`, {
        responseType: 'blob', // Important for receiving binary data
      });
  
      // Create a Blob from the PDF Stream
      const file = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a link element, use it to download the blob, then remove it
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `certificate_${courseId}_${userId}.pdf`;
      link.click();
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error('Error fetching certificate:', error);
      // Handle error (e.g., show an error message to the user)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        alert(`Failed to fetch certificate. Error: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        alert('No response received from server. Please try again later.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        alert('An unexpected error occurred. Please try again later.');
      }
    }
  };







  const renderQuizButton = (quiz) => {
    if (quiz.status) {
      // Quiz has a status message
      return (
        <>
        <Button
          variant="outlined"
          color={quiz.status.includes('passed') ? 'success' : 'error'}
          disabled
        >
          {quiz.status}
        </Button>
        {quiz.status.toLowerCase().includes('passed') && (
          <Button 
          color="success"
          variant="contained"
          onClick={() => handleViewCertificate(currentCourse?.id,user?.id)}>
            View Certificate
          </Button>
        )}
        </>
      );
    } else {
      // Quiz is available to take
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleStartQuiz(quiz.id)}
        >
          Start: {quiz.title}
        </Button>
      );
    }
  
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-3">Quizzes</h2>
     
      {courseQuizzes.length > 0 ? (
        courseQuizzes.map((quiz) => (
          <div key={quiz.id} className="mb-2">
            {renderQuizButton(quiz)}
          </div>
        ))
      ) : (
        <p>No quizzes available for this course.</p>
      )}
    
    </div>
  );
};

export default QuizSection;