import React, { useState } from 'react';

const AWS_BUCKET = 'https://mxedulearnerbucket.s3.ap-south-1.amazonaws.com/';

export function getFullImageUrl(relativePath) {
  if (!relativePath) return null;
  
  // If the path already starts with http or https, assume it's a full URL
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // Ensure the relative path doesn't start with a slash
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  
  // Construct the full S3 URL
  return `${AWS_BUCKET}${cleanPath}`;
}

// Usage in your React component
function ProfileImage({ user }) {
  const [imageSrc, setImageSrc] = useState(() => getFullImageUrl(user.profile_pic));
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true);
      setImageSrc(getFullImageUrl('path/to/fallback/image.png')); // Make sure this fallback image exists in your S3 bucket
    }
  };

  if (!imageSrc) {
    return <div>No image available</div>;
  }

  return (
    <img
      src={imageSrc}
      alt="Profile"
      className="w-full h-full object-cover"
      onError={handleImageError}
    />
  );
}

export default ProfileImage;