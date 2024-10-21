import React, { useContext } from 'react';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    // <footer className={`${darkMode ? 'bg-dark-gray-200 text-dark-white' : 'bg-light-blueberry text-white'} py-8 `}>
    //   <div className="container mx-auto px-4">
    //     <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    //       <div>
    <footer className={`${
      darkMode ? 'bg-dark-gray-200 text-dark-white' : 'bg-light-blueberry text-white'
    } py-8 mt-auto`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">MXEduLearners</h3>
            <p>Empowering learners worldwide</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Learn</h4>
            <ul>
              <li><Link to="/courses">Courses</Link></li>
              <li><Link to="/tutorials">Tutorials</Link></li>
              <li><Link to="/resources">Resources</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <ul>
              <li><Link to="/forums">Forums</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/events">Events</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/support">Support</Link></li>
            </ul>
          </div>
        </div>
        {/* <div className="mt-8 pt-8 border-t border-gray-700">
          <p>&copy; 2024 MXEduLearners. All rights reserved.</p>
        </div> */}
        <div className="mt-8 pt-8 border-t border-gray-700">
              <p>&copy; 2024 MXEduLearners. All rights reserved.</p>
            </div>
      </div>
    </footer>
  );
};

export default Footer;