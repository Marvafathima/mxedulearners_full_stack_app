import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, LinearProgress } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchQuiz, submitQuiz, setCurrentQuestion, answerQuestion } from '../../../store/quizareaSlice';
import Layout from './Layout';
import {  Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Check, X, Award, Frown } from 'lucide-react';


const QuizResultModal = ({ isOpen, handleClose, totalScore, percentage }) => {
  const isPassed = percentage >= 40;

  return (
    <Dialog 
      open={isOpen} 
      onClose={handleClose}
      PaperProps={{
        style: {
          borderRadius: '15px',
          padding: '20px',
          minWidth: '300px',
          textAlign: 'center'
        }
      }}
    >
      <DialogContent>
        <div className="flex flex-col items-center">
          {isPassed ? (
            <Award size={80} color="#4CAF50" className="mb-4" />
          ) : (
            <Frown size={80} color="#F44336" className="mb-4" />
          )}
          <Typography variant="h4" className="mb-4 font-bold">
            {isPassed ? 'Congratulations!' : 'Better Luck Next Time!'}
          </Typography>
          <Typography variant="h6" className="mb-2">
            Total Score: {totalScore}
          </Typography>
          <Typography variant="h6" className="mb-4">
            Percentage: {percentage}%
          </Typography>
          <div className={`flex items-center justify-center w-24 h-24 rounded-full mb-4 ${isPassed ? 'bg-green-100' : 'bg-red-100'}`}>
            <Typography 
              variant="h3" 
              className={`font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}
            >
              {isPassed ? <Check size={48} /> : <X size={48} />}
            </Typography>
          </div>
          <Typography 
            variant="h5" 
            className={`font-bold mb-6 ${isPassed ? 'text-green-600' : 'text-red-600'}`}
          >
            {isPassed ? 'Passed' : 'Failed'}
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleClose}
            style={{ 
              backgroundColor: isPassed ? '#4CAF50' : '#F44336',
              color: 'white',
              borderRadius: '20px',
              padding: '10px 20px'
            }}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};




const QuizComponent = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const navigate=useNavigate()
  const { quizId } = useParams(); 
  const quiz = useSelector(state => state.quizarea.currentQuiz);
  const currentQuestionIndex = useSelector(state => state.quizarea.currentQuestionIndex);
  const answers = useSelector(state => state.quizarea.answers);
  const { currentCourse, status, error } = useSelector(state => state.courses);
  const [timeLeft, setTimeLeft] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
   // Helper function to convert time string "hh:mm:ss" to seconds
   const timeStringToSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return (hours * 3600) + (minutes * 60) + seconds;
  };
  useEffect(() => {
    const submitted = sessionStorage.getItem('quizSubmitted');
    if (submitted) {
      console.log("submitted")
      // If the quiz was submitted, redirect the user
      navigate(`/mycourse/${currentCourse?.id}`);  // Redirect to the results page or another appropriate page
    }
  }, [navigate]);
  useEffect(() => {
  dispatch(fetchQuiz(quizId)).then(result => {
    const fetchedQuiz = result.payload;
    if (fetchedQuiz && fetchedQuiz.time_limit) {
      const totalTimeInSeconds = timeStringToSeconds(fetchedQuiz.time_limit);
      setTimeLeft(totalTimeInSeconds);  // Initialize timeLeft with the quiz time limit
    }
   
  });
  }, [dispatch, quizId]);

  
  useEffect(() => {
    if (timeLeft !== null) {  // Ensure that timeLeft is initialized
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 0) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);  // Cleanup timer on component unmount
    }
  }, [timeLeft]);
  const handleAnswer = (questionId, answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
    dispatch(answerQuestion({ questionId, answerId }));
  };

  const handleNext = () => {
    dispatch(setCurrentQuestion(currentQuestionIndex + 1));
  };

  const handlePrevious = () => {
    dispatch(setCurrentQuestion(currentQuestionIndex - 1));
  };
 
  const handleSubmit = () => {
    console.log(selectedAnswers,quizId)
    dispatch(submitQuiz({selectedAnswers,quizId}))
    .unwrap() // Unwrap the resolved or rejected action
    .then((response) => {
      console.log("response",response)
      setTotalScore(response.score);
    setPercentage(response.percentage);
    sessionStorage.setItem('quizSubmitted', true);
    // Open the result modal
    setModalOpen(true);
        // This runs if the action was fulfilled
    //     alert(`Quiz submitted successfully! Your score: ${response.score}, Percentage: ${response.percentage}`);
    // 
  })
    .catch((error) => {
        // This runs if the action was rejected
        toast.error(`Error submitting quiz: ${error.message || 'Unknown error occurred'}`);
    });;
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    navigate(`/mycourse/${currentCourse?.id}`)
  };
  if (!quiz) return <div>Loading...</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <Layout>
    <div className="flex h-screen">
      {/* Question status sidebar */}
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Questions</h2>
        <div className="grid grid-cols-5 gap-2">
          {quiz.questions.map((question, index) => (
            <button
              key={question.id}
              className={`w-10 h-10 rounded-md ${
                selectedAnswers[question.id] 
                  ? 'bg-green-500' 
                  : index === currentQuestionIndex 
                  ? 'bg-yellow-500'
                  : 'bg-gray-300'
              }`}
              onClick={() => dispatch(setCurrentQuestion(index))}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main quiz area */}
      <div className="w-3/4 p-8">
        {/* Timer */}
        <div className="mb-4">
          <LinearProgress 
            variant="determinate" 
            value={(timeLeft / timeStringToSeconds(quiz.time_limit)) * 100} 
            // value={(timeLeft / (quiz.time_limit * 60)) * 100} 
          />
          <p className="text-right mt-2 text-danger">Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
          </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{currentQuestion?.text}</h2>
          {currentQuestion.answers.map(answer => (
            <Button
              key={answer.id}
              variant={selectedAnswers[currentQuestion.id] === answer.id ? "contained" : "outlined"}
              className={`block w-full mb-2 p-4 text-left ${
                selectedAnswers[currentQuestion.id] === answer.id ? 'bg-blue-500 text-white' : ''
              }`}
              onClick={() => handleAnswer(currentQuestion.id, answer.id)}
            >
              <span className="flex items-center">
                {selectedAnswers[currentQuestion.id] === answer.id && (
                  <Check className="mr-2" size={20} />
                )}
                {answer.text}
              </span>
            </Button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outlined"
            startIcon={<ChevronLeft />}
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            Submit Quiz
          </Button>
          <Button
            variant="outlined"
            endIcon={<ChevronRight />}
            onClick={handleNext}
            disabled={currentQuestionIndex === quiz.questions.length - 1}
          >
            Next
          </Button>
          {/* Result Modal */}
      <QuizResultModal 
        isOpen={modalOpen} 
        handleClose={handleCloseModal}
        totalScore={totalScore}
        percentage={percentage}
      />
        </div>
      </div>
    </div>
    </Layout>
  );
};

export default QuizComponent;