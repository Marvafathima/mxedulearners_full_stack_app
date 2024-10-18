import React, { useContext } from 'react';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const categories = [
  'Full Stack Development',
  'Frontend',
  'Backend',
  'Data Science',
  'Machine Learning',
  'Cybersecurity',
  'Mobile App Development'
];

const Subnavbar = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={`${darkMode ? 'bg-dark-gray-100' : 'bg-dark-lightblue'} py-2`}>
      <div className="container mx-auto flex justify-between items-center overflow-x-auto">
        {categories.map((category, index) => (
          <Link 
            key={index} 
            to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
            className={`${darkMode ? 'text-dark-white hover:text-dark-gray-100' : 'text-black hover:text-dark-gray-100'} whitespace-nowrap px-3 py-1`}
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subnavbar;