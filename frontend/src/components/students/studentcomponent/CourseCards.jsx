
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Skeleton from '@mui/material/Skeleton';
// import { fetchAllCourses } from '../../../store/courseSlice';
// import CourseCard from './CourseCard';

// const CourseCards = () => {
//   const dispatch = useDispatch();
//   const { courses, status, error, currentPage, hasMore } = useSelector((state) => state.courses);
//   const [isLoading, setIsLoading] = useState(false);

//   const loadCourses = (page) => {
//     if (!isLoading && hasMore) {
//       setIsLoading(true);
//       dispatch(fetchAllCourses({ page }))
//         .unwrap()
//         .finally(() => setIsLoading(false));
//     }
//   };

//   useEffect(() => {
//     if (status === 'idle') {
//       loadCourses(currentPage); // Load the initial courses on component mount
//     }
//   }, [status, dispatch, currentPage]);

//   const handleLoadMore = () => {
//     if (!isLoading && hasMore) {
//       loadCourses(currentPage + 1); // Increment the page number when "Load More" is clicked
//     }
//   };

//   if (status === 'failed') {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
//         {courses.map((course) => (
//           <CourseCard key={course.id} course={course} />
//         ))}
//       </div>

//       {/* Skeleton loading indicator */}
//       {(status === 'loading' || isLoading) && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
//           {[...Array(4)].map((_, index) => (
//             <Skeleton key={index} variant="rectangular" width="100%" height={200} />
//           ))}
//         </div>
//       )}

//       {/* Load More Button */}
//       {hasMore && (
//         <div className="text-center my-8">
//           <button
//             onClick={handleLoadMore}
//             disabled={isLoading}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           >
//             {isLoading ? 'Loading...' : 'Load More'}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CourseCards;
// import React, { useEffect, useState } from 'react';

// import Skeleton from '@mui/material/Skeleton';
// import CourseCard from './CourseCard';
// import { userInstance as axios} from '../../../api/axios';
// const CourseCards = () => {
//   const [courses, setCourses] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   const fetchCourses = async (page) => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`/coursemanagement/courses_fetchall/?page=${page}&limit=4`);
//       const newCourses = response.data.courses;
//       setCourses(prevCourses => [...prevCourses, ...newCourses]);
//       setCurrentPage(response.data.currentPage);
//       setHasMore(response.data.hasMore);
//     } catch (error) {
//       setError(error.response?.data?.message || 'An error occurred while fetching courses');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourses(currentPage);
//   }, []);

//   const handleLoadMore = () => {
//     if (!isLoading && hasMore) {
//       fetchCourses(currentPage + 1);
//     }
//   };

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
//         {courses.map((course) => (
//           <CourseCard key={course.id} course={course} />
//         ))}
//       </div>

//       {/* Skeleton loading indicator */}
//       {isLoading && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-8">
//           {[...Array(4)].map((_, index) => (
//             <Skeleton key={index} variant="rectangular" width="100%" height={200} />
//           ))}
//         </div>
//       )}

//       {/* Load More Button */}
//       {hasMore && (
//         <div className="text-center my-8">
//           <button
//             onClick={handleLoadMore}
//             disabled={isLoading}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//           >
//             {isLoading ? 'Loading...' : 'Load More'}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CourseCards;
import React, { useEffect, useState } from 'react';

import Skeleton from '@mui/material/Skeleton';
import CourseCard from './CourseCard';
import { userInstance as axios} from '../../../api/axios';
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