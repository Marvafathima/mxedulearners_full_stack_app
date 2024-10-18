import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { store } from './store/store';
import LandingPage from './components/Landing';
import { ThemeProvider } from './contexts/ThemeContext';
import Home  from './components/Home';
import ProtectedAdminRoute from './components/routes/ProtectedAdminRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLoginPage from './components/admin/AdminLoginPage';
import RequestTutorPage from './components/admin/tutors/RequestTutorPage';
import TutorHome from './components/tutor/TutorHome';
import ProtectedUserRoute from './components/routes/ProtectedUserRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CourseForm from './components/tutor/CourseForm';
import StudentHomepage from './components/students/studentpages/StudentHomepage';
import { useContext } from 'react';
import { ThemeContext } from './contexts/ThemeContext';
import ToastWrapper from './components/ToastWrapper';
import StudentProfile from './components/students/studentcomponent/StudentProfile';
import TutorList from './components/admin/tutors/TutorList';
import StudentList from './components/admin/student/StudentList';
import CourseList from './components/tutor/CourseList';
import QuizCreationForm from './components/tutor/QuizCreationForm';
import CourseDetail from './components/students/studentcomponent/CourseDetail';
import CartPage from './components/students/studentcomponent/CartPage';
import CheckoutPage from './components/students/studentcomponent/CheckoutPage';
import MycourseDetail from './components/students/studentcomponent/MycourseDetail';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/store/store';
import MyCoursesPage from './components/students/studentcomponent/MyCoursePage';
import QuizComponent from './components/students/studentcomponent/QuizComponent';
import StudentDetailPage from './components/admin/student/StudentDetailPage';
import  TutorDetailPage  from './components/admin/tutors/TutorDetailPage';
import { AdminCourseList } from './components/admin/course/AdminCourseList';
import AdminCourseDetailPage from './components/admin/course/AdminCourseDetailPage';
import QuizList from './components/tutor/QuizList';
import EducationDetailsPage from './components/tutor/EducationDetailsPage';
import QuizDetailPage from './components/tutor/QuizDetailPage';
import ChatComponent from './components/ChatComponent';
import TutorChatPage from './components/tutor/TutorChatPage';
import StudentChatPage from './components/students/studentpages/StudentChatPage';
import ForgotPassword from './components/ForgotPassword';
import { WebSocketProvider } from './contexts/WebSocketContext';
function App() {
  // const { darkMode } = useContext(ThemeContext);
  return (
    <Provider store={store}>
       <ThemeProvider>
       <WebSocketProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/landing-page" element={<LandingPage/>} />
            <Route path="/forgot_password" element={<ForgotPassword/>} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/chat" element= {<ChatComponent roomName="general" />}/>

            <Route element={<ProtectedUserRoute allowedRoles={['tutor']} />}>
          <Route path="/tutor-home" element={<TutorHome />} />
           <Route path="/tutor/create-course" element={<CourseForm/>} />
           <Route path='/tutor/courses' element={<CourseList/>}/>
           <Route path='/tutor/create-quiz' element={<QuizCreationForm/>}/>
           <Route path='/tutor/quiz_list/' element={<QuizList/>}/>
           <Route path='/quiz-detail/:quizid' element={<QuizDetailPage/>}/>
           <Route path='/tutor/education_view' element={<EducationDetailsPage/>}/>
           <Route path='/tutor/chat' element={<TutorChatPage/>}/>
         {/* <Route path="/tutor/course-preview" element={<CoursePreview />} /> */}
        </Route>

        <Route element={<ProtectedUserRoute allowedRoles={['student']} />}>
          <Route path="/student-home" 
          element={<StudentHomepage />} 
        
          />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/checkout'element={<CheckoutPage />} />
          <Route path='/my_courses'element={<MyCoursesPage />} />
          <Route path='/mycourse/:id'element={<MycourseDetail/>} />
          <Route path='/quiz/:quizId'element={<QuizComponent/>} />
          <Route path='/student/chat'element={<StudentChatPage/>} />
        </Route>

            <Route path="/admin/dashboard"  
            element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } 
            />
 <Route path="/admin/tutors/requests"  
            element={
                <ProtectedAdminRoute>
                  <RequestTutorPage/>
                </ProtectedAdminRoute>
              } 
            />
  <Route path="/admin/tutorlist"  
            element={
                <ProtectedAdminRoute>
                  <TutorList />
                </ProtectedAdminRoute>
              } 
            />
 <Route path="/admin/students"  
            element={
                <ProtectedAdminRoute>
                  <StudentList />
                </ProtectedAdminRoute>
              } 
            />

<Route path="/admin/student-detail"  
            element={
                <ProtectedAdminRoute>
                  <StudentDetailPage />
                </ProtectedAdminRoute>
              } 
            />

<Route path="/admin/tutor-detail"  
            element={
                <ProtectedAdminRoute>
                 <TutorDetailPage/>
                </ProtectedAdminRoute>
              } 
            />
<Route path="/admin/courses"  
            element={
                <ProtectedAdminRoute>
                 <AdminCourseList/>
                </ProtectedAdminRoute>
              } 
            />
<Route path="/admin/courses/course_detail/:courseId"  
            element={
                <ProtectedAdminRoute>
                 <AdminCourseDetailPage/>
                </ProtectedAdminRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
      <ToastWrapper />
      {/* <ToastContainer theme={darkMode ? 'light' : 'dark'} /> */}
      </WebSocketProvider>
      </ThemeProvider>
    
    </Provider>
  );
}

export default App;
