
import React, { useEffect, useState } from 'react';

import Skeleton from '@mui/material/Skeleton';
import CourseCard from './CourseCard';
import { userInstance as axios} from '../../../api/axios';
import { Paper } from '@mui/material';
const CourseCards = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCourses = async (page) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`/coursemanagement/courses_fetchall/?page=${page}&limit=8`);
      const newCourses = response.data.courses;
      
      setCourses(prevCourses => {
        // Create a Set of existing course IDs for efficient lookup
        const existingIds = new Set(prevCourses.map(course => course.id));
        
        // Filter out any new courses that already exist in the state
        const uniqueNewCourses = newCourses.filter(course => !existingIds.has(course.id));
        
        // Return the combined array of existing and new unique courses
        return [...prevCourses, ...uniqueNewCourses];
      });

      setCurrentPage(response.data.currentPage);
      setHasMore(response.data.hasMore);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while fetching courses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, []);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchCourses(currentPage + 1);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!isLoading && courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <Paper
          elevation={8}
          className="p-8 rounded-2xl flex flex-col items-center max-w-lg"
          sx={{
            background: 'white',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-5px)'
            }
          }}
        >
          <img
            src="/student2.svg" // Make sure this matches your SVG file name in public folder
            alt="No courses available"
            className="w-64 h-64 mb-6"
          />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            No Courses Available
          </h3>
          <p className="text-gray-600 text-center">
            There are currently no courses available. Check back later for new content.
          </p>
        </Paper>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Skeleton loading indicator */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" width="100%" height={200} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center my-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseCards;