
import React, { useState } from 'react';
import { Typography, Box, Card, CardContent, Chip, Pagination, Button, Modal, TextField, Radio, RadioGroup, FormControlLabel, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import TutorNavbar from './TutorNavbar';
import TutorSidebar from './TutorSidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
// import { editQuiz } from '../actions/quizActions'; // Assuming you have this action creator
import { updateQuiz } from '../../store/quizSlice';
const QuizDetailPage = () => {
  const location = useLocation();
  const { quizData: initialQuizData } = location.state || {};
 const navigate=useNavigate();
  const { quizzes } = useSelector((state) => state.tutorquiz); 
  const [quizData, setQuizData] = useState(initialQuizData || {}); 

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const questionsPerPage = 5;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const displayedQuestions = quizData.questions.slice(startIndex, endIndex);

  const handleEditClick = (question) => {
    setEditingQuestion({ ...question, options: [...question.options] });
    setEditModalOpen(true);
  };

  const handleDeleteQuestion = (questionId) => {
    const updatedQuestions = quizData.questions.filter(q => q.id !== questionId);
    dispatch(updateQuiz({ ...quizData, questions: updatedQuestions }));
  };

  const handleQuestionChange = (e) => {
    setEditingQuestion({ ...editingQuestion, text: e.target.value });
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = editingQuestion.options.map((option, i) => 
      i === index ? { ...option, [field]: value } : option
    );
    setEditingQuestion({ ...editingQuestion, options: updatedOptions });
  };

  const handleAddOption = () => {
    setEditingQuestion({
      ...editingQuestion,
      options: [...editingQuestion.options, { id: Date.now(), text: '', is_correct: false }]
    });
  };

  const handleDeleteOption = (optionId) => {
    setEditingQuestion({
      ...editingQuestion,
      options: editingQuestion.options.filter(option => option.id !== optionId)
    });
  };
  useEffect(() => {
    // Fetch the updated quiz from quizzes array based on the quiz ID
    const updatedQuiz = quizzes.find(q => q.id === quizData.id);
    if (updatedQuiz) {
      setQuizData(updatedQuiz); // Update the local state with the updated quiz
    }
  }, [quizzes, quizData.id]); // Re-run when quizzes or quizData.id changes


//   const handleSaveEdit = () => {
//     const updatedQuestions = quizData.questions.map(q => 
//       q.id === editingQuestion.id ? editingQuestion : q
//     );
//     console.log("updatedquestions we sending to backend",updatedQuestions)
//     console.log("updatedquestions we sending to backend",quizData)
//     dispatch(updateQuiz({id:quizData.id, ...quizData, questions: updatedQuestions }));
//     setEditModalOpen(false);
//   };
const handleSaveEdit = () => {
    console.log("editing question",editingQuestion)
    // Dispatch only the updated question and necessary IDs
    dispatch(updateQuiz({
      quizId: quizData.id, // Quiz ID
      questionId: editingQuestion.id, // Question ID
      updatedQuestion: editingQuestion // Updated question data
    }))
    .unwrap() // Unwrap the promise to handle success or failure
  .then(() => {
    // Success toast notification
    toast.success("Question updated successfully!")
    navigate('/tutor/quiz_list/')

    // const updatedQuiz = quizzes.find(q => q.id === quizData.id);
    // if (updatedQuiz) {
    //   setQuizData(updatedQuiz); // Update the state with the new quiz data
    // }
    setEditModalOpen(false); // Close the modal after saving
    // After success, re-fetch the quiz data from Redux
    
  })
  .catch((error) => {
    // Error toast notification
    toast.error(`Error: ${error}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
    });
  });
};



  return (
    <div className="flex h-screen bg-gray-100">
      <TutorSidebar user={user} />
      <div className="flex flex-col flex-grow">
        <TutorNavbar user={user} />
        <div className="p-6 overflow-auto">
          <Typography variant="h4" className="mb-4 text-gray-800">
            {quizData.title}
          </Typography>
          <Card className="mb-6">
            <CardContent>
              <Typography variant="h6" className="mb-2">
                Course: {quizData.course}
              </Typography>
              <Typography variant="body1" className="mb-2">
                Description: {quizData.description}
              </Typography>
              <Typography variant="body2" className="mb-2">
                Time Limit: {quizData.time_limit}
              </Typography>
              <Typography variant="body2" className="mb-2">
                Total Points: {quizData.points}
              </Typography>
              <Typography variant="body2">
                Total Questions: {quizData.questions.length}
              </Typography>
            </CardContent>
          </Card>

          {displayedQuestions.map((question, index) => (
            <Card key={question.id} className="mb-4">
              <CardContent>
                <Box className="flex justify-between items-center mb-2">
                  <Typography variant="h6">
                    Question {startIndex + index + 1}: {question.text}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleEditClick(question)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteQuestion(question.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" className="mb-2">
                  Marks: {question.marks} | Negative Marks: {question.negative_marks}
                </Typography>
                <Box className="space-y-2">
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Chip
                        label={option.text}
                        color={option.is_correct ? "success" : "default"}
                        variant={option.is_correct ? "filled" : "outlined"}
                      />
                      {option.is_correct && (
                        <Typography variant="body2" className="text-green-600">
                          (Correct Answer)
                        </Typography>
                      )}
                    </div>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}

          {quizData.questions.length > questionsPerPage && (
            <Box className="flex justify-center mt-4">
              <Pagination
                count={Math.ceil(quizData.questions.length / questionsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}

          <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
            <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-3/4 max-w-2xl">
              <Typography variant="h6" className="mb-4">Edit Question</Typography>
              <TextField
                fullWidth
                label="Question"
                value={editingQuestion?.text || ''}
                onChange={handleQuestionChange}
                className="mb-4"
              />
              <Typography variant="subtitle1" className="mb-2">Options:</Typography>
              {editingQuestion?.options.map((option, index) => (
                <Box key={option.id} className="flex items-center space-x-2 mb-2">
                  <RadioGroup
                    value={option.is_correct}
                    onChange={(e) => handleOptionChange(index, 'is_correct', e.target.value === 'true')}
                  >
                    <FormControlLabel value={true} control={<Radio />} label="" />
                  </RadioGroup>
                  <TextField
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                    className="flex-grow"
                  />
                  <IconButton onClick={() => handleDeleteOption(option.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button startIcon={<AddIcon />} onClick={handleAddOption} className="mt-2">
                Add Option
              </Button>
              <Box className="mt-4 flex justify-end">
                <Button onClick={() => setEditModalOpen(false)} className="mr-2">Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleSaveEdit}>Save</Button>
              </Box>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default QuizDetailPage;