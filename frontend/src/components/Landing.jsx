import React, { useState, useEffect,useContext} from 'react';

import { ThemeContext } from '../contexts/ThemeContext';
import Modal from './Modal';
import Register from './Register';
import OTPVerification from './OTPVerification';
import Login from './Login';
import TutorApplication from './tutor/TutorApplication';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button } from './ui/button';
import { ArrowRight, BookOpen, Users, Award, Star } from 'lucide-react';


const Navbar = () => {
    const { darkMode, toggleTheme } = useContext(ThemeContext);
    const [isTutorApplicationOpen, setIsTutorApplicationOpen] = useState(false);
    const { role } = useSelector((state) => state.auth);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isOTPVerificationOpen, setIsOTPVerificationOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');



    const handleRegisterSuccess = (email) => {
      setIsRegisterOpen(false);
      setRegisteredEmail(email);
      setIsOTPVerificationOpen(true);
      toast.info(`Please enter the OTP sent to ${email}`)
    };
    const handleRegisterError = () => { 
      setIsRegisterOpen(false);
    };
    const handleOTPVerificationSuccess = (userRole) => {
      setIsOTPVerificationOpen(false);
      if (userRole === 'tutor') {
        setIsTutorApplicationOpen(true);
      } else {
        setIsLoginOpen(true);
      }
    };
   
  
    const handleLoginSuccess = () => {
      setIsLoginOpen(false);
      // Navigate to home page or update state as needed
    };
    const handleTutorApplicationSuccess = () => {
      setIsTutorApplicationOpen(false);
      setIsLoginOpen(true);
      // You can show a message here that the application is under review
    };
    return (
      <nav className={`${darkMode ? 'bg-dark-gray-300' : 'bg-light-blueberry'} p-4`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className={`${darkMode ? 'text-dark-white' : 'text-white'} text-xl font-bold`}>MXEduLearners</div>
          <div className="flex items-center space-x-4">
            <NavItem darkMode={darkMode} href="/">Home</NavItem>
            <button onClick={() => setIsRegisterOpen(true)} className={`${darkMode ? 'text-dark-white hover:text-dark-gray-100' : 'text-white hover:text-light-applecore'}`}>Sign Up</button>
            <button onClick={() => setIsLoginOpen(true)} className={`${darkMode ? 'text-dark-white hover:text-dark-gray-100' : 'text-white hover:text-light-applecore'}`}>Login</button>
            <button onClick={() => setIsTutorApplicationOpen(true)} className={`${darkMode ? 'text-dark-white hover:text-dark-gray-100' : 'text-white hover:text-light-applecore'}`}>Tutor Application</button>
            <NavItem darkMode={darkMode} href="/admin/login">Admin</NavItem>
            <button 
              onClick={toggleTheme}
              className={`${darkMode ? 'bg-dark-gray-200 text-dark-white hover:bg-dark-gray-100' : 'bg-light-apricot text-white hover:bg-light-citrus'} px-3 py-1 rounded transition-colors`}
            >
              Toggle Theme
            </button>
         
          </div>
        </div>
        <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)}>
        <Register onSuccess={handleRegisterSuccess} 
        onError={handleRegisterError}
         />
      </Modal>
      <Modal isOpen={isOTPVerificationOpen} onClose={() => setIsOTPVerificationOpen(false)}>
        <OTPVerification email={registeredEmail} onSuccess={handleOTPVerificationSuccess} />
      </Modal>
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <Login onSuccess={handleLoginSuccess} />
      </Modal>
      <Modal isOpen={isTutorApplicationOpen} onClose={() => setIsTutorApplicationOpen(false)}>
        <TutorApplication onSuccess={handleTutorApplicationSuccess} />
      </Modal>
      </nav>
    );
  };

  
  
  

const NavItem = ({ darkMode, href, children }) => (
  <a href={href} className={`${darkMode ? 'text-dark-white hover:text-dark-gray-100' : 'text-white hover:text-light-applecore'}`}>{children}</a>
);

// const LandingPage = () => {
//   const { darkMode, toggleTheme } = useContext(ThemeContext);


//   return (
//     <div className={`${darkMode ? 'bg-dark-gray-300' : 'bg-light-applecore'} min-h-screen`}>
//       <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
//       <main className="container mx-auto mt-10 p-4">
//         <h1 className={`${darkMode ? 'text-dark-white' : 'text-light-blueberry'} text-4xl font-bold mb-4`}>
//           Welcome to MXEduLearners
//         </h1>
      
//         <p className={`${darkMode ? 'text-dark-gray-100' : 'text-light-apricot'} mb-6`}>
//           Empowering learners with innovative educational solutions.
//         </p>
//         <Button className={`${darkMode ? 'bg-dark-gray-200 text-dark-white hover:bg-dark-gray-100' : 'bg-light-citrus text-white hover:bg-light-apricot'} px-6 py-2 rounded transition-colors`}>
//           Get Started
//         </Button>
     
//       </main>
//     </div>
//   );
// };

// export default LandingPage;

const FeatureCard = ({ title, description, icon: Icon }) => {
  const { darkMode} = useContext(ThemeContext);
  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-dark-gray-200' : 'bg-white'} shadow-lg`}>
      <div className={`${darkMode ? 'text-dark-white' : 'text-light-blueberry'} mb-4`}>
        <Icon size={24} />
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-dark-white' : 'text-light-blueberry'}`}>
        {title}
      </h3>
      <p className={`${darkMode ? 'text-dark-gray-100' : 'text-gray-600'}`}>
        {description}
      </p>
    </div>
  );
};

const LandingPage = () => {
  const { darkMode,toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`${darkMode ? 'bg-dark-gray-300' : 'bg-white'} min-h-screen`}>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme}/>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className={`text-5xl font-bold mb-6 ${darkMode ? 'text-dark-white' : 'text-light-blueberry'}`}>
            Transform Your Learning Journey
          </h1>
          <p className={`text-xl mb-8 ${darkMode ? 'text-dark-gray-100' : 'text-gray-600'}`}>
            Join thousands of students and expert tutors in a dynamic learning marketplace. 
            Master new skills at your own pace with personalized instruction.
          </p>
          <div className="flex gap-4">
            <Button className="bg-light-blueberry hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2">
              Get Started <ArrowRight size={20} />
            </Button>
            <Button variant="outline" className={`${darkMode ? 'border-dark-white text-dark-white' : 'border-light-blueberry text-light-blueberry'} px-8 py-3 rounded-lg`}>
              Browse Courses
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img 
            src="/education1.svg" 
            alt="Learning illustration" 
            className="max-w-md rounded-lg shadow-xl"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className={`${darkMode ? 'bg-dark-gray-200' : 'bg-gray-50'} py-16`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Active Students" },
              { number: "1,000+", label: "Expert Tutors" },
              { number: "5,000+", label: "Courses" },
              { number: "95%", label: "Satisfaction Rate" }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className={`text-3xl font-bold mb-2 ${darkMode ? 'text-dark-white' : 'text-light-blueberry'}`}>
                  {stat.number}
                </div>
                <div className={`${darkMode ? 'text-dark-gray-100' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-dark-white' : 'text-light-blueberry'}`}>
          Why Choose MXEduLearners?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={BookOpen}
            title="Diverse Course Selection"
            description="Access thousands of courses across multiple disciplines, from programming to data science."
          />
          <FeatureCard
            icon={Users}
            title="Expert Tutors"
            description="Learn from industry professionals and experienced educators who are passionate about teaching."
          />
          <FeatureCard
            icon={Award}
            title="Certified Learning"
            description="Earn recognized certificates upon course completion to boost your professional profile."
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`${darkMode ? 'bg-dark-gray-200' : 'bg-gray-50'} py-20`}>
        <div className="container mx-auto px-4">
          <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-dark-white' : 'text-light-blueberry'}`}>
            What Our Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Web Developer",
                content: "The quality of instruction and course materials exceeded my expectations. I landed my dream job after completing the web development track!"
              },
              {
                name: "Michael Chen",
                role: "Data Scientist",
                content: "The platform's flexibility allowed me to learn at my own pace while working full-time. The tutors are incredibly knowledgeable and supportive."
              },
              {
                name: "Emma Williams",
                role: "UX Designer",
                content: "I've tried many online learning platforms, but MXEduLearners stands out for its interactive approach and practical projects."
              }
            ].map((testimonial, idx) => (
              <div key={idx} className={`p-6 rounded-lg ${darkMode ? 'bg-dark-gray-300' : 'bg-white'} shadow-lg`}>
                <div className="flex items-center mb-4">
                  <Star className="text-yellow-400" size={20} />
                  <Star className="text-yellow-400" size={20} />
                  <Star className="text-yellow-400" size={20} />
                  <Star className="text-yellow-400" size={20} />
                  <Star className="text-yellow-400" size={20} />
                </div>
                <p className={`mb-4 ${darkMode ? 'text-dark-gray-100' : 'text-gray-600'}`}>
                  "{testimonial.content}"
                </p>
                <div className={`font-semibold ${darkMode ? 'text-dark-white' : 'text-light-blueberry'}`}>
                  {testimonial.name}
                </div>
                <div className={`text-sm ${darkMode ? 'text-dark-gray-100' : 'text-gray-600'}`}>
                  {testimonial.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-dark-white' : 'text-light-blueberry'}`}>
          Ready to Start Your Learning Journey?
        </h2>
        <p className={`text-xl mb-8 max-w-2xl mx-auto ${darkMode ? 'text-dark-gray-100' : 'text-gray-600'}`}>
          Join our community of learners today and take the first step towards achieving your educational goals.
        </p>
        <Button className="bg-light-blueberry hover:bg-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 mx-auto">
          Get Started Now <ArrowRight size={20} />
        </Button>
      </section>
    </div>
  );
};

export default LandingPage;



