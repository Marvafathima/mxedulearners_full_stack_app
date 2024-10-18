import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitTutorApplication } from '../../store/authSlice';

import { toast } from 'react-toastify';

const TutorApplication = ({ onSuccess }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
      email: '',
      education_qualification: '',
      certificate: null,
      job_experience: '',
      experience_proof: null,
    });
  
    const handleChange = (e) => {
      if (e.target.type === 'file') {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
      } else {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const applicationData = new FormData();
      for (const key in formData) {
        applicationData.append(key, formData[key]);
      }
      dispatch(submitTutorApplication(applicationData)).then((result) => {
        if (!result.error) {
          onSuccess();
        }
        else{
        toast.error(`${error.detail}`)
        }
      });
    };

    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="education_qualification"
            value={formData.education_qualification}
            onChange={handleChange}
            placeholder="Education Qualification"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="file"
            name="certificate"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="job_experience"
            value={formData.job_experience}
            onChange={handleChange}
            placeholder="Job Experience"
            className="w-full p-2 border rounded"
          />
          <input
            type="file"
            name="experience_proof"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Submit Tutor Application
          </button>
          {error && <p className="text-red-500">{error.detail}</p>}
        </form>
      );
    };
    
    export default TutorApplication;






// const TutorApplication = ({ userId, onSuccess }) => {
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.auth);
//   const [formData, setFormData] = useState({
//     education_qualification: '',
//     certificate: null,
//     job_experience: '',
//     experience_proof: null,
//   });

//   const handleChange = (e) => {
//     if (e.target.type === 'file') {
//       setFormData({ ...formData, [e.target.name]: e.target.files[0] });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const applicationData = new FormData();
//     for (const key in formData) {
//       applicationData.append(key, formData[key]);
//     }
//     applicationData.append('user_id', userId);
//     dispatch(submitTutorApplication(applicationData)).then(() => {
//       onSuccess();
//     });
//   };


//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <textarea
//         name="education_qualification"
//         value={formData.education_qualification}
//         onChange={handleChange}
//         placeholder="Education Qualification"
//         className="w-full p-2 border rounded"
//         required
//       />
//       <input
//         type="file"
//         name="certificate"
//         onChange={handleChange}
//         className="w-full p-2 border rounded"
//         required
//       />
//       <textarea
//         name="job_experience"
//         value={formData.job_experience}
//         onChange={handleChange}
//         placeholder="Job Experience"
//         className="w-full p-2 border rounded"
//       />
//       <input
//         type="file"
//         name="experience_proof"
//         onChange={handleChange}
//         className="w-full p-2 border rounded"
//       />
//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//       >
//         Submit Tutor Application
//       </button>
//       {error && <p className="text-red-500">{error}</p>}
//     </form>
//   );
// };

// export default TutorApplication;