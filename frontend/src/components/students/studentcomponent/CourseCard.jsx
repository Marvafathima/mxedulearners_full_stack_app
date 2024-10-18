
import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useMemo } from 'react';
import { fetchCourseDetail } from '../../../store/courseSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const discountedPrice = course.offer_percentage > 0
    ? course.price - (course.price * course.offer_percentage / 100)
    : course.price;
   
    const dispatch = useDispatch();
    const navigate = useNavigate();
  const thumbnailURL = useMemo(() => {
    const thumbnailPath = course.thumbnail;
    return `${thumbnailPath}`;
  }, [course.thumbnail]);

  const handleViewDetails = () => {
    dispatch(fetchCourseDetail(course.id));
    navigate(`/course/${course.id}`);
  };


  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden relative group">
      <img   
        src={thumbnailURL} 
        alt={course.name} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 uppercase text-black">{course.name}</h3>
        <p className="text-gray-600">
          {course.user?.username}
        
          </p>
        <div className="mt-2">
          <span className="text-yellow-500">{course.rating}</span>
          <span className="text-gray-500 ml-2">({course.lessons?.length} lessons)</span>
        </div>
        <div className="mt-2">
          {course.offer_percentage > 0 ? (
            <>
              <span className="font-bold text-lg text-black">₹{discountedPrice.toFixed(2)}</span>
              <span className="text-gray-500 line-through ml-2">₹{course.price}</span>
            </>
          ) : (
            <span className="font-bold text-lg text-black">₹{course.price}</span>
          )}
        </div>
        <p className="mt-2">Points: {course.points}</p>
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-75 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col">
        <div className="p-4 overflow-y-auto flex-grow">
          <h3 className="font-bold text-lg mb-2 uppercase">{course.name}</h3>
          <p className="mb-2">{course.description}</p>
          <p>Total lessons: {course.lessons?.length}</p>
        </div>
        <div className="p-4 mt-auto flex">
        <button onClick={handleViewDetails} className="flex-grow bg-purple-900 text-white px-4 py-2 mr-1 rounded">View Details</button>
          <button className="flex-grow bg-purple-500 text-white px-4 py-2 rounded">Add to cart</button>
          <button className="ml-2 text-white p-2"><FaHeart size={24} /></button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;