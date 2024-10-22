// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchCourseDetail } from '../../store/courseSlice';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Avatar } from '@/components/ui/avatar';
// import { User } from 'lucide-react';

// const CourseDetailModal = ({ isOpen, onClose, courseId }) => {
//   const dispatch = useDispatch();
//   const { currentCourse, status } = useSelector(state => state.courses);

//   React.useEffect(() => {
//     if (isOpen && courseId) {
//       dispatch(fetchCourseDetail(courseId));
//     }
//   }, [dispatch, courseId, isOpen]);

//   if (status === 'loading') {
//     return (
//       <Dialog open={isOpen} onOpenChange={onClose}>
//         <DialogContent className="max-w-3xl">
//           <div className="flex items-center justify-center p-8">
//             <p>Loading course details...</p>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   if (!currentCourse) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-3xl">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold">{currentCourse.name}</DialogTitle>
//         </DialogHeader>
        
//         <ScrollArea className="max-h-[80vh]">
//           <div className="space-y-6 p-4">
//             {/* Course Thumbnail */}
//             <div className="w-full h-64 relative rounded-lg overflow-hidden">
//               <img 
//                 src={currentCourse.thumbnail} 
//                 alt={currentCourse.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             {/* Instructor Info */}
//             <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
//               {currentCourse.user.profile_pic ? (
//                 <Avatar>
//                   <img src={currentCourse.user.profile_pic} alt={currentCourse.user.username} />
//                 </Avatar>
//               ) : (
//                 <Avatar>
//                   <User className="w-6 h-6" />
//                 </Avatar>
//               )}
//               <div>
//                 <h3 className="font-semibold">Instructor</h3>
//                 <p>{currentCourse.user.username}</p>
//               </div>
//             </div>

//             {/* Course Description */}
//             <div className="space-y-2">
//               <h3 className="text-lg font-semibold">About this course</h3>
//               <p className="text-gray-600">{currentCourse.description}</p>
//             </div>

//             {/* Course Points */}
//             {currentCourse.points && (
//               <div className="space-y-2">
//                 <h3 className="text-lg font-semibold">What you'll learn</h3>
//                 <ul className="list-disc pl-5 space-y-1">
//                   {currentCourse.points.map((point, index) => (
//                     <li key={index} className="text-gray-600">{point}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Course Lessons */}
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold">Course Content</h3>
//                 <span className="text-sm text-gray-500">
//                   {currentCourse.lessons.length} lessons
//                 </span>
//               </div>
              
//               <div className="space-y-3">
//                 {currentCourse.lessons.map((lesson, index) => (
//                   <div 
//                     key={index}
//                     className="p-4 bg-gray-50 rounded-lg space-y-2"
//                   >
//                     <h4 className="font-medium">
//                       {index + 1}. {lesson.title}
//                     </h4>
//                     <p className="text-sm text-gray-600">{lesson.description}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CourseDetailModal;
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourseDetail } from '../../store/courseSlice';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent,
  Avatar,
  Box,
  Typography,
  List,
  ListItem,
  Paper,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';

const CourseDetailModal = ({ isOpen, onClose, courseId }) => {
  const dispatch = useDispatch();
  const { currentCourse, status } = useSelector(state => state.courses);

  React.useEffect(() => {
    if (isOpen && courseId) {
      dispatch(fetchCourseDetail(courseId));
    }
  }, [dispatch, courseId, isOpen]);

  if (status === 'loading') {
    return (
      <Dialog 
        open={isOpen} 
        onClose={onClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <Typography>Loading course details...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  if (!currentCourse) return null;

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h2" fontWeight="bold">
            {currentCourse.name}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 2 }}>
          {/* Course Thumbnail */}
          <Box sx={{ 
            width: '100%', 
            height: 320, 
            borderRadius: 1,
            overflow: 'hidden',
            '& img': {
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }
          }}>
            <img 
              src={currentCourse.thumbnail} 
              alt={currentCourse.name}
            />
          </Box>

          {/* Instructor Info */}
          <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={currentCourse.user.profile_pic}>
                {!currentCourse.user.profile_pic && <PersonIcon />}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="medium">
                  Instructor
                </Typography>
                <Typography variant="body2">
                  {currentCourse.user.username}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Course Description */}
          <Box>
            <Typography variant="h6" gutterBottom>
              About this course
            </Typography>
            <Typography color="text.secondary">
              {currentCourse.description}
            </Typography>
          </Box>

          {/* Course Points */}
          {/* {currentCourse.points && (
            <Box>
              <Typography variant="h6" gutterBottom>
                What you'll learn
              </Typography>
              <List sx={{ listStyleType: 'disc', pl: 2 }}>
                {currentCourse.points.map((point, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      display: 'list-item',
                      color: 'text.secondary',
                      py: 0.5
                    }}
                  >
                    <Typography variant="body2">
                      {point}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          )} */}

          {/* Course Lessons */}
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Course Content
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentCourse.lessons.length} lessons
              </Typography>
            </Box>

            <Box display="flex" flexDirection="column" gap={1.5}>
              {currentCourse.lessons.map((lesson, index) => (
                <Paper 
                  key={index}
                  sx={{ 
                    p: 2, 
                    bgcolor: 'grey.50'
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    {index + 1}. {lesson.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {lesson.description}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailModal;







