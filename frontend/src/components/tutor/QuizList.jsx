import React, { useEffect, useState } from 'react';
import { userInstance as axios } from '../../api/axios';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import TutorSidebar from './TutorSidebar';
import { settutorQuizzes } from '../../store/tutorQuizSlice';
import TutorLayout from './TutorLayout';
const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();
  const {user}=useSelector(state=>state.auth)
  const dispatch=useDispatch();
  const calculateExtraFields = (quizzesData) => {
    return quizzesData.map((quiz) => {
      const totalLessons = quiz.questions.length;
      const totalPoints = quiz.questions.reduce((sum, question) => sum + question.marks, 0);

      // Return the quiz object with additional fields
      return {
        ...quiz,
        totalLessons: totalLessons,  
        points: totalPoints,         
      };
    });
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('/quizmanagement/quiz_list/');
        console.log("quiz response:",response.data)
        dispatch(settutorQuizzes(response.data))
        const processedData = calculateExtraFields(response.data);
        setQuizzes(processedData);
        
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
    fetchQuizzes();
  }, []);
  console.log("my quizzes right now",quizzes)
  
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'course', headerName: 'Course', width: 200 },
    // { field: 'created_at', headerName: 'Created At', width: 200 },
    { field: 'totalLessons', headerName: 'Total Questions', width: 150 
    },
    { field: 'points', headerName: 'Points', width: 100,
  
  },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <div className="flex justify-end">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleView(params.row)}
            className="mr-2"
          >
            View
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(params.row)}
            className="mr-2"
          >
            Delete
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleUpdate(params.row)}
          >
            Update
          </Button>
        </div>
      ),
    },
  ];

  const handleView = (quiz) => {
    const quizDetails = quizzes.find(q => q.id === quiz.id);
    console.log("quizdetail to be send to detail page",quizDetails)
    navigate(`/quiz-detail/${quiz.id}`, { state: { quizData: quizDetails } });
  };
  // const handleView = (quiz) => {
  //   navigate(`/quizzes/${quiz.id}`);
  // };

  const handleDelete = (quiz) => {
    // Implement delete logic here
    console.log('Deleting quiz:', quiz);
  };

  const handleUpdate = (quiz) => {
    navigate(`/quizzes/${quiz.id}/edit`);
  };

  return (
    <TutorLayout user={user}>
    <div className="flex">
    <div className="fixed h-screen">
      {/* <TutorSidebar user={user} /> */}
    </div>
    <div className="flex-grow ml-64 p-6  bg-light ">
      <Typography variant="h4" gutterBottom>
        Quizzes
      </Typography>
      <div style={{ height: 400, width: '100%', text:'white'}}>
        <DataGrid
          rows={quizzes}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </div>
    </div> </div></TutorLayout>
  );
};

export default QuizList;