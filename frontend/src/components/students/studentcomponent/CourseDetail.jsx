import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaHeart, FaChevronDown } from 'react-icons/fa';
import Navbar from './Navbar';
import Subnavbar from './SubNavbar';
import Footer from './Footer';
import { fetchStudentDetails } from '../../../store/authSlice';
import { fetchCourseDetail } from '../../../store/courseSlice';
import { addToCart } from '../../../store/cartSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const CourseDetail = () => {
    const { id } = useParams();
  const dispatch = useDispatch();
  const navigate=useNavigate();
  const { currentCourse, status, error } = useSelector(state => state.courses);
  const { user,loading,usererror } = useSelector((state) => state.auth);
  // const handleAddToCart = () => {
  //   try{
  //     const result= dispatch(addToCart(currentCourse.id));
  //     if (addToCart.fulfilled.match(result)) {
  //       toast.success("Successfully added course to the cart")
  //       navigate('/cart')
  //     }
  //   }
  //   catch{
  //     toast.error("Error adding course to the cart")
  //   }
    
  // };
  const handleAddToCart = () => {
    dispatch(addToCart(currentCourse.id)).then((action) => {
      if (action.payload.items) {
        toast.success('Course added to cart successfully!');
        
      } else {
        toast.error(action.payload.error || 'Failed to add course to cart.');
      }
    });
  };


  useEffect(() => {
    if (id) {
      dispatch(fetchCourseDetail(id));
    }
  }, [dispatch, id]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;
  if (! currentCourse) return null;


  return (
    <div className="bg-gray-100 min-h-screen">
       <Navbar 
      user={user}
       />
     <Subnavbar/>
      {/* Hero Section */}
      <div className="relative h-96">
        <img 
          src={`${ currentCourse.thumbnail}`} 
          alt={ currentCourse.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center px-8">
          <h1 className="text-4xl font-bold text-white mb-4">{ currentCourse.name}</h1>
          <p className="text-xl text-white">{ currentCourse.description}</p>
        </div>
      </div>

      {/* Course Info */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            {/* <p className="text-gray-600">Created at: {new Date( currentCourse.created_at).toLocaleDateString()}</p> */}
            <p className="text-gray-600">Creator: { currentCourse.user.username}</p>
          </div>
          <div className="flex items-center">
            <button className="bg-purple-500 text-white px-6 py-2 rounded-lg mr-4"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button className="text-purple-500">
              <FaHeart size={24} />
            </button>
          </div>
        </div>

        {/* Curriculum */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Curriculum</h2>
          { currentCourse.lessons.map((lesson, index) => (
            <div key={lesson.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{index + 1}. {lesson.title}</h3>
                <FaChevronDown />
              </div>
              <p className="text-gray-600 mt-2">{lesson.description}</p>
            </div>
          ))}
        </div>

        {/* Course Features */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Course Features</h2>
          <ul className="list-disc list-inside">
            <li>Total Lessons: { currentCourse.lessons.length}</li>
            <li>Total Duration: { currentCourse.total_duration} minutes</li>
            {/* <li>Rating: { currentCourse.rating}</li> */}
            <li>Points: { currentCourse.points}</li>
          </ul>
        </div>

        {/* Mentor */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Mentor</h2>
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <img 
              src={`${ currentCourse.user.profile_pic}`} 
              alt={ currentCourse.user.username} 
              className="w-20 h-20 rounded-full mr-4"
            />
            <div>
              <h3 className="text-xl font-semibold">{ currentCourse.user.username}</h3>
              <p className="text-gray-600">{ currentCourse.user.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;