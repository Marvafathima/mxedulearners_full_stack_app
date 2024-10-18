// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { FaPlus, FaMinus, FaEdit, FaTrash } from 'react-icons/fa';
// import TutorSidebar from './TutorSidebar';
// // Assume you have actions for fetching courses and saving quizzes
// import { fetchTutorCourses } from '../../store/courseSlice';
// import { fetchQuizzes, addQuiz, updateQuiz, deleteQuiz  } from '../../store/quizSlice';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import TutorLayout from './TutorLayout';
// const QuizCreationForm = () => {
//   const dispatch = useDispatch();
//   const { tutorcourses, coursestatus, courseerror } = useSelector(state => state.courses);
//   const navigate=useNavigate();
//   const user = useSelector(state => state.auth.user);
//   const { quizzes, status, error } = useSelector(state => state.quizzes);
//   const [quizData, setQuizData] = useState({
//     title: '',
//     courseId: '',
//     timeLimit: { hours: 0, minutes: 0, seconds: 0 },
//     description: '',
//     questions: []
//   });

//   const [currentQuestion, setCurrentQuestion] = useState({
//     question: '',
//     options: ['', ''],
//     correctOption: 0,
//     marks: 1,
//     negativeMarks: 0
//   });

//   useEffect(() => {
//     dispatch(fetchTutorCourses());
//   }, [dispatch]);


//   useEffect(() => {
//     dispatch(fetchQuizzes());
//   }, [dispatch]);

//   // const handleAddQuiz = (quizData) => {
//   //   dispatch(addQuiz(quizData));
//   // };

//   // const handleUpdateQuiz = (id, quizData) => {
//   //   dispatch(updateQuiz({ id, quizData }));
//   // };

//   // const handleDeleteQuiz = (id) => {
//   //   dispatch(deleteQuiz(id));
//   // };









//   const handleQuizDataChange = (e) => {
//     const { name, value } = e.target;
//     setQuizData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleTimeChange = (unit, value) => {
//     setQuizData(prev => ({
//       ...prev,
//       timeLimit: { ...prev.timeLimit, [unit]: parseInt(value) || 0 }
//     }));
//   };

//   const handleQuestionChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentQuestion(prev => ({ ...prev, [name]: value }));
//   };

//   const handleOptionChange = (index, value) => {
//     setCurrentQuestion(prev => ({
//       ...prev,
//       options: prev.options.map((opt, i) => i === index ? value : opt)
//     }));
//   };

//   const addOption = () => {
//     setCurrentQuestion(prev => ({
//       ...prev,
//       options: [...prev.options, '']
//     }));
//   };

//   const removeOption = (index) => {
//     setCurrentQuestion(prev => ({
//       ...prev,
//       options: prev.options.filter((_, i) => i !== index)
//     }));
//   };

//   const saveQuestion = () => {
//     setQuizData(prev => ({
//       ...prev,
//       questions: [...prev.questions, currentQuestion]
//     }));
//     setCurrentQuestion({
//       question: '',
//       options: ['', ''],
//       correctOption: 0,
//       marks: 1,
//       negativeMarks: 0
//     });
//   };

//   const editQuestion = (index) => {
//     setCurrentQuestion(quizData.questions[index]);
//     setQuizData(prev => ({
//       ...prev,
//       questions: prev.questions.filter((_, i) => i !== index)
//     }));
//   };

//   const deleteQuestion = (index) => {
//     setQuizData(prev => ({
//       ...prev,
//       questions: prev.questions.filter((_, i) => i !== index)
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     try{
//       dispatch(addQuiz(quizData)).unwrap();
//       toast.success("Quiz created Successfully")
//       navigate('/tutor/quiz_list/')
//     }
//     catch(error){
//      toast.error(`Error in creating Quiz.${error}`)
//     }
   
    
//   };

//   return (
//     <TutorLayout user={user}>
//     <div className="flex bg-blue min-h-screen">
//       {/* <TutorSidebar user={user} /> */}
//       <div className="flex-grow p-6 ml-64 bg-light-ash">
//         <h1 className="text-2xl font-bold mb-6">Create New Quiz</h1>
//         <div className="flex space-x-6">
//           <form onSubmit={handleSubmit} className="w-1/2 bg-dark-gray-100 p-6 rounded-lg shadow-md">
//             <div className="mb-4">
//               <label className="block mb-2 font-bold">Quiz Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={quizData.title}
//                 onChange={handleQuizDataChange}
//                 className="w-full p-2 border rounded text-black"
//                 required
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-2 font-bold">Course</label>
//               <select
//                 name="courseId"
//                 value={quizData.courseId}
//                 onChange={handleQuizDataChange}
//                 className="w-full p-2 border rounded text-black"
//                 required
//               >
//                 <option value="">Select a course</option>
//                 {tutorcourses.map(course => (
//                   <option key={course.id} value={course.id}>{course.name}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="mb-4">
//               <label className="block mb-2 font-bold">Time Limit</label>
//               <div className="flex space-x-2">
//                 {['hours', 'minutes', 'seconds'].map(unit => (
//                   <input
//                     key={unit}
//                     type="number"
//                     value={quizData.timeLimit[unit]}
//                     onChange={(e) => handleTimeChange(unit, e.target.value)}
//                     className="w-20 p-2 border rounded text-black"
//                     min="0"
//                     placeholder={unit}
//                   />
//                 ))}
//               </div>
//             </div>
//             <div className="mb-4">
//               <label className="block mb-2 font-bold">Description</label>
//               <textarea
//                 name="description"
//                 value={quizData.description}
//                 onChange={handleQuizDataChange}
//                 className="w-full p-2 border rounded text-black"
//                 rows="3"
//               ></textarea>
//             </div>
//             <div className="mb-4">
//               <label className="block mb-2 font-bold">Question</label>
//               <input
//                 type="text"
//                 name="question"
//                 value={currentQuestion.question}
//                 onChange={handleQuestionChange}
//                 className="w-full p-2 border rounded text-black"
//               />
//             </div>
//             <div className="mb-4">
//               <label className="block mb-2 font-bold">Options</label>
//               {currentQuestion.options.map((option, index) => (
//                 <div key={index} className="flex items-center mb-2">
//                   <input
//                     type="radio"
//                     name="correctOption"
//                     value={index}
//                     checked={currentQuestion.correctOption === index}
//                     onChange={() => setCurrentQuestion(prev => ({ ...prev, correctOption: index }))}
//                     className="mr-2 text-black"
//                   />
//                   <input
//                     type="text"
//                     value={option}
//                     onChange={(e) => handleOptionChange(index, e.target.value)}
//                     className="flex-grow p-2 border rounded text-black"
//                   />
//                   {index > 1 && (
//                     <button type="button" onClick={() => removeOption(index)} className="ml-2 text-red-500">
//                       <FaMinus />
//                     </button>
//                   )}
//                 </div>
//               ))}
//               <button type="button" onClick={addOption} className="text-yellow-200">
//                 <FaPlus /> Add Option
//               </button>
//             </div>
//             <div className="mb-4 flex space-x-4">
//               <div>
//                 <label className="block mb-2 font-bold">Marks</label>
//                 <input
//                   type="number"
//                   name="marks"
//                   value={currentQuestion.marks}
//                   onChange={handleQuestionChange}
//                   className="w-20 p-2 border rounded"
//                   min="0"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-2 font-bold">Negative Marks</label>
//                 <input
//                   type="number"
//                   name="negativeMarks"
//                   value={currentQuestion.negativeMarks}
//                   onChange={handleQuestionChange}
//                   className="w-20 p-2 border rounded"
//                   min="0"
//                 />
//               </div>
//             </div>
//             <div className="flex space-x-4">
//               <button
//                 type="button"
//                 onClick={saveQuestion}
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 Save Question
//               </button>
//               <button
//                 type="submit"
//                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//               >
//                 Finish Quiz
//               </button>
//             </div>
//           </form>
//           <div className="w-1/2 bg-dark-gray-100 p-6 rounded-lg shadow-md">
//             <h2 className="text-xl font-bold mb-4">Question Preview</h2>
//             {quizData.questions.map((q, index) => (
//               <div key={index} className="mb-4 p-4 border rounded">
//                 <p className="font-bold">{q.question}</p>
//                 <ul className="list-disc pl-5 mt-2">
//                   {q.options.map((opt, i) => (
//                     <li key={i} className={i === q.correctOption ? "text-green-500" : ""}>
//                       {opt}
//                     </li>
//                   ))}
//                 </ul>
//                 <p className="mt-2">Marks: {q.marks}, Negative Marks: {q.negativeMarks}</p>
//                 <div className="mt-2 flex space-x-2">
//                   <button onClick={() => editQuestion(index)} className="text-blue-500">
//                     <FaEdit />
//                   </button>
//                   <button onClick={() => deleteQuestion(index)} className="text-red-500">
//                     <FaTrash />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//     </TutorLayout>
//   );
// };

// export default QuizCreationForm;
// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import {
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   IconButton,
//   Card,
//   CardContent,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Divider,
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Remove as RemoveIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Check as CheckIcon,
// } from '@mui/icons-material';
// import { fetchTutorCourses } from '../../store/courseSlice';
// import { fetchQuizzes, addQuiz } from '../../store/quizSlice';
// import TutorLayout from './TutorLayout';

// const QuizCreationForm = () => {
//   // ... (previous state and useEffect hooks remain unchanged)

//   return (
//     <TutorLayout user={user}>
//       <div className="flex bg-gray-100 min-h-screen">
//         <div className="flex-grow p-6 ml-64">
//           <Typography variant="h4" className="mb-6 font-bold">Create New Quiz</Typography>
//           <div className="flex space-x-6">
//             {/* Form section remains unchanged */}
//             <form onSubmit={handleSubmit} className="w-1/2 bg-white p-6 rounded-lg shadow-md">
//               {/* ... (form fields remain the same) */}
//             </form>

//             {/* Updated Question Preview section */}
//             <div className="w-1/2">
//               <Typography variant="h5" className="mb-4 font-bold">Question Preview</Typography>
//               {quizData.questions.map((q, index) => (
//                 <Card key={index} className="mb-4 border border-gray-200">
//                   <CardContent>
//                     <Typography variant="h6" className="mb-2 font-bold">
//                       Question {index + 1}:
//                     </Typography>
//                     <Typography variant="body1" className="mb-4">
//                       {q.question}
//                     </Typography>
//                     <List className="mb-4">
//                       {q.options.map((opt, i) => (
//                         <ListItem key={i} disablePadding>
//                           <ListItemIcon>
//                             {i === q.correctOption ? (
//                               <CheckIcon className="text-green-500" />
//                             ) : (
//                               <Radio disabled />
//                             )}
//                           </ListItemIcon>
//                           <ListItemText 
//                             primary={opt}
//                             className={i === q.correctOption ? "text-green-500 font-semibold" : ""}
//                           />
//                         </ListItem>
//                       ))}
//                     </List>
//                     <Divider className="mb-4" />
//                     <div className="flex justify-between items-center">
//                       <Typography variant="body2">
//                         Marks: {q.marks} | Negative Marks: {q.negativeMarks}
//                       </Typography>
//                       <div>
//                         <IconButton 
//                           onClick={() => editQuestion(index)} 
//                           color="primary"
//                           className="mr-2"
//                         >
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton 
//                           onClick={() => deleteQuestion(index)} 
//                           color="error"
//                         >
//                           <DeleteIcon />
//                         </IconButton>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </TutorLayout>
//   );
// };

// export default QuizCreationForm;















import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { fetchTutorCourses } from '../../store/courseSlice';
import { fetchQuizzes, addQuiz } from '../../store/quizSlice';
import TutorLayout from './TutorLayout';

const QuizCreationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tutorcourses } = useSelector(state => state.courses);
  const user = useSelector(state => state.auth.user);
  
  const [quizData, setQuizData] = useState({
    title: '',
    courseId: '',
    timeLimit: { hours: 0, minutes: 0, seconds: 0 },
    description: '',
    questions: []
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', ''],
    correctOption: 0,
    marks: 1,
    negativeMarks: 0
  });

  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchTutorCourses());
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const handleQuizDataChange = (e) => {
    const { name, value } = e.target;
    setQuizData(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (unit, value) => {
    setQuizData(prev => ({
      ...prev,
      timeLimit: { ...prev.timeLimit, [unit]: parseInt(value) || 0 }
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const saveQuestion = () => {
    // Validate question input
    if (!currentQuestion.question.trim()) {
      toast.error("Question text cannot be empty");
      return;
    }

    // Validate options
    const nonEmptyOptions = currentQuestion.options.filter(opt => opt.trim() !== '');
    if (nonEmptyOptions.length < 2) {
      toast.error("At least two non-empty options are required");
      return;
    }

    // Update the question with only non-empty options
    const updatedQuestion = {
      ...currentQuestion,
      options: nonEmptyOptions,
      correctOption: Math.min(currentQuestion.correctOption, nonEmptyOptions.length - 1)
    };

    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, updatedQuestion]
    }));
    setCurrentQuestion({
      question: '',
      options: ['', ''],
      correctOption: 0,
      marks: 1,
      negativeMarks: 0
    });
    setCurrentPreviewIndex(quizData.questions.length);
  };

  const editQuestion = (index) => {
    setCurrentQuestion(quizData.questions[index]);
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
    setCurrentPreviewIndex(Math.min(currentPreviewIndex, quizData.questions.length - 2));
  };

  const deleteQuestion = (index) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
    setCurrentPreviewIndex(Math.min(currentPreviewIndex, quizData.questions.length - 2));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quizData.questions.length === 0) {
      toast.error("Please add at least one question to the quiz");
      return;
    }
    dispatch(addQuiz(quizData))
    .then((resultAction) => {
      if (addQuiz.fulfilled.match(resultAction)) {
        toast.success("Quiz created Successfully");
        navigate('/tutor/quiz_list/');
      } else if (addQuiz.rejected.match(resultAction)) {
        const error = resultAction.payload;
        console.error('Error:', error);
        toast.error(`Error creating quiz: ${error?.message || 'Unknown error occurred'}`);
        
      }
    })
    .catch((error) => {
      console.error('Unexpected error:', error);
      toast.error(`Unexpected error: ${error.message || 'Unknown error occurred'}`);

    })
    // try {
      // const resultAction =dispatch(addQuiz(quizData))
      // console.log("resultAction:",resultAction)
      // const newww=addQuiz.fulfilled
      // console.log("newww:",newww)
      // if (addQuiz.fulfilled.match(resultAction)){
      //   toast.success("Quiz created Successfully");
      //   navigate('/tutor/quiz_list/');
      // }
      // else if (addQuiz.rejected.match(resultAction)){
      //   toast.error(`${resultAction.error}`);
      //   navigate('/tutor/quiz_list/');
      // }

      // dispatch(addQuiz(quizData)).unwrap();
      // toast.success("Quiz created Successfully");
      // navigate('/tutor/quiz_list/');




    // } catch (error) {
    //   toast.error(`Error in creating Quiz. ${error}`);
    // }
  };

  const handlePreviousQuestion = () => {
    setCurrentPreviewIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextQuestion = () => {
    setCurrentPreviewIndex(prev => Math.min(quizData.questions.length - 1, prev + 1));
  };

  return (
    <TutorLayout user={user}>
      <div className="flex bg-gray-100 min-h-screen">
        <div className="flex-grow p-6 ml-64">
          <Typography variant="h4" className="mb-6 font-bold">Create New Quiz</Typography>
          <div className="flex space-x-6">
            <form onSubmit={handleSubmit} className="w-1/2 bg-white p-6 rounded-lg shadow-md">
              {/* ... (form fields remain the same) */}
              <TextField
                fullWidth
                label="Quiz Title"
                name="title"
                value={quizData.title}
                onChange={handleQuizDataChange}
                className="mb-4"
                required
              />
              <FormControl fullWidth className="mb-4">
                <InputLabel>Course</InputLabel>
                <Select
                  name="courseId"
                  value={quizData.courseId}
                  onChange={handleQuizDataChange}
                  required
                >
                  <MenuItem value="">Select a course</MenuItem>
                  {tutorcourses.map(course => (
                    <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div className="mb-4">
                <Typography variant="subtitle1" className="mb-2">Time Limit</Typography>
                <div className="flex space-x-2">
                  {['hours', 'minutes', 'seconds'].map(unit => (
                    <TextField
                      key={unit}
                      type="number"
                      label={unit.charAt(0).toUpperCase() + unit.slice(1)}
                      value={quizData.timeLimit[unit]}
                      onChange={(e) => handleTimeChange(unit, e.target.value)}
                      className="w-1/3"
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  ))}
                </div>
              </div>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={quizData.description}
                onChange={handleQuizDataChange}
                className="mb-4"
              />
              <TextField
                fullWidth
                label="Question"
                name="question"
                value={currentQuestion.question}
                onChange={handleQuestionChange}
                className="mb-4"
              />
              <Typography variant="subtitle1" className="mb-2">Options</Typography>
              <RadioGroup
                value={currentQuestion.correctOption}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctOption: parseInt(e.target.value) }))}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <FormControlLabel
                      value={index}
                      control={<Radio />}
                      label={
                        <TextField
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          className="ml-2 flex-grow"
                        />
                      }
                    />
                    {index > 1 && (
                      <IconButton onClick={() => removeOption(index)} color="error">
                        <RemoveIcon />
                      </IconButton>
                    )}
                  </div>
                ))}
              </RadioGroup>
              <Button
                startIcon={<AddIcon />}
                onClick={addOption}
                className="mb-4 text-blue-500"
              >
                Add Option
              </Button>
              <div className="flex space-x-4 mb-4">
                <TextField
                  type="number"
                  label="Marks"
                  name="marks"
                  value={currentQuestion.marks}
                  onChange={handleQuestionChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />
                <TextField
                  type="number"
                  label="Negative Marks"
                  name="negativeMarks"
                  value={currentQuestion.negativeMarks}
                  onChange={handleQuestionChange}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </div>
              {/* Add the save question button here */}
              <Button
                variant="contained"
                color="primary"
                onClick={saveQuestion}
                className="mt-4"
              >
                Save Question
              </Button>
            </form>

            {/* Updated Question Preview section with pagination */}
            <div className="w-1/2">
              <Typography variant="h5" className="mb-4 font-bold">Question Preview</Typography>
              {quizData.questions.length > 0 ? (
                <Card className="border border-gray-200">
                  <CardContent>
                    <Typography variant="h6" className="mb-2 font-bold">
                      Question {currentPreviewIndex + 1} of {quizData.questions.length}:
                    </Typography>
                    <Typography variant="body1" className="mb-4">
                      {quizData.questions[currentPreviewIndex].question}
                    </Typography>
                    <List className="mb-4">
                      {quizData.questions[currentPreviewIndex].options.map((opt, i) => (
                        <ListItem key={i} disablePadding>
                          <ListItemIcon>
                            {i === quizData.questions[currentPreviewIndex].correctOption ? (
                              <CheckIcon className="text-green-500" />
                            ) : (
                              <Radio disabled />
                            )}
                          </ListItemIcon>
                          <ListItemText 
                            primary={opt}
                            className={i === quizData.questions[currentPreviewIndex].correctOption ? "text-green-500 font-semibold" : ""}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Divider className="mb-4" />
                    <div className="flex justify-between items-center">
                      <Typography variant="body2">
                        Marks: {quizData.questions[currentPreviewIndex].marks} | 
                        Negative Marks: {quizData.questions[currentPreviewIndex].negativeMarks}
                      </Typography>
                      <div>
                        <IconButton 
                          onClick={() => editQuestion(currentPreviewIndex)} 
                          color="primary"
                          className="mr-2"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => deleteQuestion(currentPreviewIndex)} 
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Typography variant="body1">No questions added yet.</Typography>
              )}
              {quizData.questions.length > 0 && (
                <div className="flex justify-between mt-4">
                  <Button
                    startIcon={<ChevronLeftIcon />}
                    onClick={handlePreviousQuestion}
                    disabled={currentPreviewIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    endIcon={<ChevronRightIcon />}
                    onClick={handleNextQuestion}
                    disabled={currentPreviewIndex === quizData.questions.length - 1}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
          <Button
            variant="contained"
            color="success"
            type="submit"
            onClick={handleSubmit}
            className="mt-6"
          >
            Finish Quiz
          </Button>
        </div>
      </div>
    </TutorLayout>
  );
};

export default QuizCreationForm;






// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import {
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   IconButton,
//   Card,
//   CardContent,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Divider,
// } from '@mui/material';
// import { Add as AddIcon, Remove as RemoveIcon, Edit as EditIcon, Delete as DeleteIcon ,
//   Check as CheckIcon,} from '@mui/icons-material';
// import { fetchTutorCourses } from '../../store/courseSlice';
// import { fetchQuizzes, addQuiz } from '../../store/quizSlice';
// import TutorLayout from './TutorLayout';

// const QuizCreationForm = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { tutorcourses } = useSelector(state => state.courses);
//   const user = useSelector(state => state.auth.user);
  
//   const [quizData, setQuizData] = useState({
//     title: '',
//     courseId: '',
//     timeLimit: { hours: 0, minutes: 0, seconds: 0 },
//     description: '',
//     questions: []
//   });

//   const [currentQuestion, setCurrentQuestion] = useState({
//     question: '',
//     options: ['', ''],
//     correctOption: 0,
//     marks: 1,
//     negativeMarks: 0
//   });

//   useEffect(() => {
//     dispatch(fetchTutorCourses());
//     dispatch(fetchQuizzes());
//   }, [dispatch]);

//   const handleQuizDataChange = (e) => {
//     const { name, value } = e.target;
//     setQuizData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleTimeChange = (unit, value) => {
//     setQuizData(prev => ({
//       ...prev,
//       timeLimit: { ...prev.timeLimit, [unit]: parseInt(value) || 0 }
//     }));
//   };

//   const handleQuestionChange = (e) => {
//     const { name, value } = e.target;
//     setCurrentQuestion(prev => ({ ...prev, [name]: value }));
//   };

//   const handleOptionChange = (index, value) => {
//     setCurrentQuestion(prev => ({
//       ...prev,
//       options: prev.options.map((opt, i) => i === index ? value : opt)
//     }));
//   };

//   const addOption = () => {
//     setCurrentQuestion(prev => ({
//       ...prev,
//       options: [...prev.options, '']
//     }));
//   };

//   const removeOption = (index) => {
//     setCurrentQuestion(prev => ({
//       ...prev,
//       options: prev.options.filter((_, i) => i !== index)
//     }));
//   };

//   const saveQuestion = () => {
//     setQuizData(prev => ({
//       ...prev,
//       questions: [...prev.questions, currentQuestion]
//     }));
//     setCurrentQuestion({
//       question: '',
//       options: ['', ''],
//       correctOption: 0,
//       marks: 1,
//       negativeMarks: 0
//     });
//   };

//   const editQuestion = (index) => {
//     setCurrentQuestion(quizData.questions[index]);
//     setQuizData(prev => ({
//       ...prev,
//       questions: prev.questions.filter((_, i) => i !== index)
//     }));
//   };

//   const deleteQuestion = (index) => {
//     setQuizData(prev => ({
//       ...prev,
//       questions: prev.questions.filter((_, i) => i !== index)
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     try {
//       dispatch(addQuiz(quizData)).unwrap();
//       toast.success("Quiz created Successfully");
//       navigate('/tutor/quiz_list/');
//     } catch (error) {
//       toast.error(`Error in creating Quiz. ${error}`);
//     }
//   };

//   return (
//     <TutorLayout user={user}>
//       <div className="flex bg-gray-100 min-h-screen">
//         <div className="flex-grow p-6 ml-64">
//           <Typography variant="h4" className="mb-6 font-bold">Create New Quiz</Typography>
//           <div className="flex space-x-6">
//             <form onSubmit={handleSubmit} className="w-1/2 bg-white p-6 rounded-lg shadow-md">
//               <TextField
//                 fullWidth
//                 label="Quiz Title"
//                 name="title"
//                 value={quizData.title}
//                 onChange={handleQuizDataChange}
//                 className="mb-4"
//                 required
//               />
//               <FormControl fullWidth className="mb-4">
//                 <InputLabel>Course</InputLabel>
//                 <Select
//                   name="courseId"
//                   value={quizData.courseId}
//                   onChange={handleQuizDataChange}
//                   required
//                 >
//                   <MenuItem value="">Select a course</MenuItem>
//                   {tutorcourses.map(course => (
//                     <MenuItem key={course.id} value={course.id}>{course.name}</MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <div className="mb-4">
//                 <Typography variant="subtitle1" className="mb-2">Time Limit</Typography>
//                 <div className="flex space-x-2">
//                   {['hours', 'minutes', 'seconds'].map(unit => (
//                     <TextField
//                       key={unit}
//                       type="number"
//                       label={unit.charAt(0).toUpperCase() + unit.slice(1)}
//                       value={quizData.timeLimit[unit]}
//                       onChange={(e) => handleTimeChange(unit, e.target.value)}
//                       className="w-1/3"
//                       InputProps={{ inputProps: { min: 0 } }}
//                     />
//                   ))}
//                 </div>
//               </div>
//               <TextField
//                 fullWidth
//                 multiline
//                 rows={3}
//                 label="Description"
//                 name="description"
//                 value={quizData.description}
//                 onChange={handleQuizDataChange}
//                 className="mb-4"
//               />
//               <TextField
//                 fullWidth
//                 label="Question"
//                 name="question"
//                 value={currentQuestion.question}
//                 onChange={handleQuestionChange}
//                 className="mb-4"
//               />
//               <Typography variant="subtitle1" className="mb-2">Options</Typography>
//               <RadioGroup
//                 value={currentQuestion.correctOption}
//                 onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctOption: parseInt(e.target.value) }))}
//               >
//                 {currentQuestion.options.map((option, index) => (
//                   <div key={index} className="flex items-center mb-2">
//                     <FormControlLabel
//                       value={index}
//                       control={<Radio />}
//                       label={
//                         <TextField
//                           value={option}
//                           onChange={(e) => handleOptionChange(index, e.target.value)}
//                           className="ml-2 flex-grow"
//                         />
//                       }
//                     />
//                     {index > 1 && (
//                       <IconButton onClick={() => removeOption(index)} color="error">
//                         <RemoveIcon />
//                       </IconButton>
//                     )}
//                   </div>
//                 ))}
//               </RadioGroup>
//               <Button
//                 startIcon={<AddIcon />}
//                 onClick={addOption}
//                 className="mb-4 text-blue-500"
//               >
//                 Add Option
//               </Button>
//               <div className="flex space-x-4 mb-4">
//                 <TextField
//                   type="number"
//                   label="Marks"
//                   name="marks"
//                   value={currentQuestion.marks}
//                   onChange={handleQuestionChange}
//                   InputProps={{ inputProps: { min: 0 } }}
//                 />
//                 <TextField
//                   type="number"
//                   label="Negative Marks"
//                   name="negativeMarks"
//                   value={currentQuestion.negativeMarks}
//                   onChange={handleQuestionChange}
//                   InputProps={{ inputProps: { min: 0 } }}
//                 />
//               </div>
//               <div className="flex space-x-4">
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={saveQuestion}
//                 >
//                   Save Question
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="success"
//                   type="submit"
//                 >
//                   Finish Quiz
//                 </Button>
//               </div>
//             </form>
//              {/* Updated Question Preview section */}
//              <div className="w-1/2">
//               <Typography variant="h5" className="mb-4 font-bold">Question Preview</Typography>
//               {quizData.questions.map((q, index) => (
//                 <Card key={index} className="mb-4 border border-gray-200">
//                   <CardContent>
//                     <Typography variant="h6" className="mb-2 font-bold">
//                       Question {index + 1}:
//                     </Typography>
//                     <Typography variant="body1" className="mb-4">
//                       {q.question}
//                     </Typography>
//                     <List className="mb-4">
//                       {q.options.map((opt, i) => (
//                         <ListItem key={i} disablePadding>
//                           <ListItemIcon>
//                             {i === q.correctOption ? (
//                               <CheckIcon className="text-green-500" />
//                             ) : (
//                               <Radio disabled />
//                             )}
//                           </ListItemIcon>
//                           <ListItemText 
//                             primary={opt}
//                             className={i === q.correctOption ? "text-green-500 font-semibold" : ""}
//                           />
//                         </ListItem>
//                       ))}
//                     </List>
//                     <Divider className="mb-4" />
//                     <div className="flex justify-between items-center">
//                       <Typography variant="body2">
//                         Marks: {q.marks} | Negative Marks: {q.negativeMarks}
//                       </Typography>
//                       <div>
//                         <IconButton 
//                           onClick={() => editQuestion(index)} 
//                           color="primary"
//                           className="mr-2"
//                         >
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton 
//                           onClick={() => deleteQuestion(index)} 
//                           color="error"
//                         >
//                           <DeleteIcon />
//                         </IconButton>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
           
//           </div>
//         </div>
//       </div>
//     </TutorLayout>
//   );
// };

// export default QuizCreationForm;
