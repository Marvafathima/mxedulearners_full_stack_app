
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

  

  const handleView = (userId) => {
    dispatch(fetchTutorDetail(userId)).then(() => {
      setIsModalOpen(true);
    });
  };

  
  return (
    <div className="bg-admin-bg p-6">
      <h2 className="text-2xl font-bold mb-4 text-admin-secondary">Tutor Requests</h2>
      {tutorRequests.length > 0 ? (
      
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
      ) : (
        <div className="flex flex-col items-center justify-center h-64">
          <img src='/search_image.svg' className="h-32 w-32 mb-4" />
          <p className="text-gray-500">No pending tutor requests</p>
        </div>
      )}

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