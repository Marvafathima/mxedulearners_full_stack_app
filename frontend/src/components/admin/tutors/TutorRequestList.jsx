// // src/components/admin/AdminTutors.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { authUserManagementInstance } from '../../../api/axios';
// import { userManagementInstance } from '../../../api/axios';
// const AdminTutors = () => {
 

//   const { type } = useParams();
//   const navigate = useNavigate();
//   const [tutors, setTutors] = useState([]);

//   useEffect(() => {
//     fetchTutors();
//   }, [type]);

//   const fetchTutors = async () => {
//     try {
//       const response = await userManagementInstance.get('/admin/tutors');
//       setTutors(response.data);
//     } catch (error) {
//       console.error('Error fetching tutors:', error);
//       if (error.response && error.response.status === 401) {
//         // Redirect to login if unauthorized
//         navigate('/admin/login');
//       }
//     }
//   };

//   const handleAction = async (tutorId, action) => {
//     try {
//       await userManagementInstance.post(`/admin/tutors/${tutorId}/${action}/`);
//       fetchTutors();
//     } catch (error) {
//       console.error(`Error ${action} tutor:`, error);
//       if (error.response && error.response.status === 401) {
//         // Redirect to login if unauthorized
//         navigate('/admin/login');
//       }
//     }
//   };
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h2 className="text-2xl font-bold mb-4">
//         {type === 'requests' ? 'Tutor Requests' : 'Verified Tutors'}
//       </h2>
//       <div className="grid gap-4">
//         {tutors.map((tutor) => (
//           <div key={tutor.id} className="bg-white p-4 rounded shadow">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="text-lg font-semibold">{tutor.email}</h3>
//                 <p className="text-sm text-gray-600">{tutor.name.toLowerCase()}</p>
//               </div>
//               <div className="space-x-2">
//                 <button
//                   onClick={() => navigate(`/admin/tutors/${tutor.id}`)}
//                   className="bg-blue-500 text-white px-3 py-1 rounded"
//                 >
//                   View
//                 </button>
//                 {type === 'requests' && (
//                   <>
//                     <button
//                       onClick={() => handleAction(tutor.id, 'approve')}
//                       className="bg-green-500 text-white px-3 py-1 rounded"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => handleAction(tutor.id, 'reject')}
//                       className="bg-red-500 text-white px-3 py-1 rounded"
//                     >
//                       Reject
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminTutors;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTutorRequests, approveTutor, rejectTutor, fetchTutorDetail } from '../../../store/userManagementSlice';

const TutorRequestList = () => {
  const dispatch = useDispatch();
  const { tutorRequests, selectedTutor, loading, error } = useSelector(state => state.userManagement);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTutorRequests());
  }, [dispatch]);

  const handleApprove = (userId) => {
    dispatch(approveTutor(userId));
  };

  const handleReject = (userId) => {
    dispatch(rejectTutor(userId));
  };

  // const handleView = (userId) => {
  //   dispatch(fetchTutorDetail(userId));
  //   setIsModalOpen(true);
  // };

  const handleView = (userId) => {
    dispatch(fetchTutorDetail(userId)).then(() => {
      setIsModalOpen(true);
    });
  };

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-admin-bg p-6">
      <h2 className="text-2xl font-bold mb-4 text-admin-secondary">Tutor Requests</h2>
      <div className="space-y-4">
        {tutorRequests.map((tutor) => (
          <div key={tutor.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-admin-primary">{tutor.email}</h3>
              <p className="text-sm text-gray-500">{tutor.username}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleApprove(tutor.id)}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(tutor.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Reject
              </button>
              <button
                onClick={() => handleView(tutor.id)}
                className="bg-admin-secondary text-white px-3 py-1 rounded hover:bg-blue-700 transition"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && selectedTutor && (
        <TutorDetailModal
          tutor={selectedTutor}
          onClose={() => setIsModalOpen(false)}
          onApprove={(userId) => {
            handleApprove(userId);
            setIsModalOpen(false);
          }}
          onReject={(userId) => {
            handleReject(userId);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

const TutorDetailModal = ({ tutor, onClose, onApprove, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{tutor.user.username}</h2>
        <p><strong>Email:</strong> {tutor.user.email}</p>
        <p><strong>Phone:</strong> {tutor.user.phone_number}</p>
        <p><strong>Education:</strong> {tutor.education_qualification}</p>
        <p><strong>Experience:</strong> {tutor.job_experience}</p>
        <div className="mt-6 flex justify-end space-x-2">
          <button onClick={() => onReject(tutor.user.id)} className="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
          <button onClick={() => onApprove(tutor.user.id)} className="bg-green-500 text-white px-4 py-2 rounded">Approve</button>
          <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default TutorRequestList;