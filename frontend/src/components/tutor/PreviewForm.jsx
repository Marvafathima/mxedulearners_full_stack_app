import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import LessonForm from './LessonForm';

const PreviewForm = () => {
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { courseData, lessons: initialLessons } = location.state;

  const [lessons, setLessons] = useState(initialLessons || []);
  const [showLessonForm, setShowLessonForm] = useState(false);

  const addLesson = (lessonData) => {
    setLessons(prev => [...prev, lessonData]);
    setShowLessonForm(false);
  };

  const editLesson = (index) => {
    // Implement edit functionality
  };

  const deleteLesson = (index) => {
    setLessons(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving course:', { ...courseData, lessons });
    navigate('/tutor/courses');
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-dark-gray-300 text-dark-white' : 'bg-light-applecore text-light-blueberry'}`}>
      <h2 className="text-2xl font-bold mb-4">Course Preview: {courseData.name}</h2>
      <img src={URL.createObjectURL(courseData.thumbnail)} alt="Course Thumbnail" className="w-full max-w-md mb-4" />
      <div className="mb-4">
        <h3 className="text-xl font-bold">Course Details</h3>
        <p>Category: {courseData.category}</p>
        <p>Price: ${courseData.price}</p>
        <p>Offer Percentage: {courseData.offer_percentage}%</p>
        <p>Description: {courseData.description}</p>
        <p>Points: {courseData.points}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold">Lessons</h3>
        {lessons.map((lesson, index) => (
          <div key={index} className="mb-2 p-2 border rounded">
            <img src={URL.createObjectURL(lesson.thumbnail)} alt={`Lesson ${lesson.lesson_number} Thumbnail`} className="w-24 h-24 object-cover float-left mr-2" />
            <p>Lesson {lesson.lesson_number}: {lesson.title}</p>
            <p>Duration: {lesson.duration}</p>
            <div>
              <button onClick={() => editLesson(index)} className="mr-2 text-blue-500">Edit</button>
              <button onClick={() => deleteLesson(index)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => setShowLessonForm(true)}
        className={`mb-4 ${darkMode ? 'bg-dark-gray-100' : 'bg-light-citrus'} text-white p-2 rounded`}
      >
        Add More Lessons
      </button>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigate('/tutor/courses')}
          className={`${darkMode ? 'bg-dark-gray-100' : 'bg-light-apricot'} text-white p-2 rounded`}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className={`${darkMode ? 'bg-dark-gray-100' : 'bg-light-citrus'} text-white p-2 rounded`}
        >
          Save Course
        </button>
      </div>
      {showLessonForm && (
        <LessonForm
          onSave={addLesson}
          onCancel={() => setShowLessonForm(false)}
          lessonNumber={lessons.length + 1}
        />
      )}
    </div>
  );
};

export default PreviewForm;