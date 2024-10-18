// utils/auth.js
export const getCurrentUserTokens = () => {
    const currentUser = localStorage.getItem('current_user');
    
    if (!currentUser) return null;
  
    const role = localStorage.getItem(`${currentUser}_role`);
    const rolePrefix = role === 'tutor' ? 'tutor_' : 'student_';
   
    return {
      accessToken: localStorage.getItem(`${currentUser}_access_token`),
      refreshToken: localStorage.getItem(`${currentUser}_refresh_token`),
      role: role
    };
  };

export const BASE_URL = 'http://127.0.0.1:8000/'; // Replace with your actual backend URL



export const AWS_BUCKET ='https://mxedulearnerbucket.s3.ap-south-1.amazonaws.com/';
export function getFullImageUrl(relativePath){
  if (!relativePath) return null;
  // If the path already starts with http or https, assume it's a full URL
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // Ensure the relative path doesn't start with a slash
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  
  // Construct the full S3 URL
  return `${AWS_BUCKET}${cleanPath}`;

  // return `${AWS_BUCKET}${relativePath}`

}