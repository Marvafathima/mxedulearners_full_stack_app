
// import React, { useEffect, useState, useRef,useContext } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Box, TextField, Button, List, IconButton, ListItem, ListItemText, Typography ,Badge} from '@mui/material';
// import Layout from '../studentcomponent/Layout';
// import EmojiPicker from 'emoji-picker-react';
// import { fetchMyTutors, addMessage, fetchChatHistory, sendMessage  , addNotification, markNotificationAsRead } from '../../../store/tutorChatSlice';
// import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
// import AttachFileIcon from '@mui/icons-material/AttachFile';
// import CloseIcon from '@mui/icons-material/Close';
// import moment from 'moment';
// import { ThemeContext } from '../../../contexts/ThemeContext';
// import { useWebSocket } from '../../../contexts/WebSocketContext';
// import { useLocation } from 'react-router-dom';
// const StudentChatPage = () => {
//   const dispatch = useDispatch();
//   const { sendMessage } = useWebSocket();
//   const [selectedTutor, setSelectedTutor] = useState(null);
//   const [message, setMessage] = useState('');
//   const { user } = useSelector((state) => state.auth);
//   const { tutors, notifications, messages, loading, error } = useSelector((state) => state.chats);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const fileInputRef = useRef(null);
//   const emojiPickerRef = useRef(null);
//   const { darkMode } = useContext(ThemeContext);
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const senderIdFromUrl = searchParams.get('sender_id');
//   useEffect(() => {
//     dispatch(fetchMyTutors(user.id));
//   }, [dispatch, user.id]);

//   useEffect(() => {
//     if (senderIdFromUrl) {
//       const tutor = tutors.find(t => t.id === parseInt(senderIdFromUrl));
//       if (tutor) {
//         setSelectedTutor(tutor);
//       }
//     }
//   }, [senderIdFromUrl, tutors]);


//   useEffect(() => {
//     if (selectedTutor) {
//       const roomName = `${Math.max(user.id, selectedTutor.id)}_${Math.min(user.id, selectedTutor.id)}`;
//       dispatch(fetchChatHistory(roomName));
//     }
//   }, [selectedTutor, user.id, dispatch]);



//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
//         setShowEmojiPicker(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   const handleTutorSelect = (tutor) => {
//     setSelectedTutor(tutor);

//   };
//   const handleSendMessage = () => {
//     if ((message.trim() || fileInputRef.current.files[0]) && selectedTutor) {
//       if (fileInputRef.current.files[0]) {
//         handleFileUpload(fileInputRef.current.files[0]);
//       } else {
//         const messageData = {
//           type: 'chat_message',
//           message: message,
//           sender_id: user.id,
//           receiver_id: selectedTutor.id,
//           room_name: `${Math.max(user.id, selectedTutor.id)}_${Math.min(user.id, selectedTutor.id)}`

//         };
        

import React, { useEffect, useState, useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, List, IconButton, ListItem, ListItemText, Typography, Avatar } from '@mui/material';
import Layout from '../studentcomponent/Layout';
import EmojiPicker from 'emoji-picker-react';
import { fetchMyTutors, fetchChatHistory } from '../../../store/tutorChatSlice';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import moment from 'moment';
import { ThemeContext } from '../../../contexts/ThemeContext';
import { useWebSocket } from '../../../contexts/WebSocketContext';
import { useLocation } from 'react-router-dom';

const StudentChatPage = () => {
  const dispatch = useDispatch();
  const { sendMessage } = useWebSocket();
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [message, setMessage] = useState('');
  const { user } = useSelector((state) => state.auth);
  const { tutors, messages, loading, error } = useSelector((state) => state.chats);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const chatContainerRef = useRef(null);
  const { darkMode } = useContext(ThemeContext);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const senderIdFromUrl = searchParams.get('sender_id');

  useEffect(() => {
    dispatch(fetchMyTutors(user.id));
  }, [dispatch, user.id]);

  useEffect(() => {
    if (senderIdFromUrl) {
      const tutor = tutors.find(t => t.id === parseInt(senderIdFromUrl));
      if (tutor) {
        setSelectedTutor(tutor);
      }
    }
  }, [senderIdFromUrl, tutors]);

  useEffect(() => {
    if (selectedTutor) {
      const roomName = `${Math.max(user.id, selectedTutor.id)}_${Math.min(user.id, selectedTutor.id)}`;
      dispatch(fetchChatHistory(roomName));
    }
  }, [selectedTutor, user.id, dispatch]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTutorSelect = (tutor) => {
    setSelectedTutor(tutor);
  };

  const handleSendMessage = () => {
    if ((message.trim() || fileInputRef.current.files[0]) && selectedTutor) {
      if (fileInputRef.current.files[0]) {
        handleFileUpload(fileInputRef.current.files[0]);
      } else {
        const messageData = {
          type: 'chat_message',
          message: message,
          sender_id: user.id,
          receiver_id: selectedTutor.id,
          room_name: `${Math.max(user.id, selectedTutor.id)}_${Math.min(user.id, selectedTutor.id)}`
        };
        
        sendMessage(messageData);
      }
      setMessage('');
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const messageData = {
        type: 'chat_message',
        message_type: 'file',
        file: e.target.result,
        fileName: file.name,
        fileType: file.type,
        sender_id: user.id,
        receiver_id: selectedTutor.id,
        room_name: `${Math.max(user.id, selectedTutor.id)}_${Math.min(user.id, selectedTutor.id)}`
      };
      sendMessage(messageData);
    };
    reader.readAsDataURL(file);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
  };

  const renderMessage = (chat) => {
    switch(chat.message_type) {
      case 'file':
        if (chat.file_type.startsWith('image/')) {
          return <img src={chat.message} alt="Uploaded" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }} />;
        } else {
          return <Button variant="outlined" size="small" href={chat.message} download>Download File</Button>;
        }
      default:
        return chat.message;
    }
  };

  const formatTimestamp = (timestamp) => {
    return moment(timestamp).format('hh:mm A');
  };

  if (loading) {
    return <Typography>Loading tutors...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  const roomName = selectedTutor ? `${Math.max(user.id, selectedTutor.id)}_${Math.min(user.id, selectedTutor.id)}` : null;
  const currentChat = roomName ? messages[roomName] || [] : [];

  return (
    <Layout>
      <Box className="flex flex-grow" sx={{ height: 'calc(100vh - 64px)', bgcolor: darkMode ? '#1e1e1e' : '#f5f5f5' }}>
        <Box className="w-1/4 border-r" sx={{ bgcolor: darkMode ? '#2d2d2d' : '#fff' }}>
          <Typography variant="h6" className="p-4" sx={{ color: darkMode ? '#fff' : '#000' }}>Tutors</Typography>
          <List>
            {tutors.map((tutor) => (
              <ListItem
                key={tutor.id}
                button
                onClick={() => handleTutorSelect(tutor)}
                selected={selectedTutor && selectedTutor.id === tutor.id}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: darkMode ? '#3d3d3d' : '#e0e0e0',
                  },
                  '&:hover': {
                    bgcolor: darkMode ? '#3d3d3d' : '#e0e0e0',
                  },
                }}
              >
                <Avatar sx={{ mr: 2 }}>{tutor.username[0].toUpperCase()}</Avatar>
                <ListItemText primary={tutor.username} sx={{ color: darkMode ? '#fff' : '#000' }} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box className="flex-grow flex flex-col" sx={{ bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
          {selectedTutor ? (
            <>
              <Typography variant="h6" className="p-4" sx={{ color: darkMode ? '#fff' : '#000', borderBottom: 1, borderColor: 'divider' }}>
                Chat with {selectedTutor.username}
              </Typography>
              <Box className="flex-grow p-4 overflow-auto" ref={chatContainerRef}>
                {currentChat.map((chat, index) => (
                  <Box
                    key={index}
                    className={`mb-4 flex ${chat.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <Box
                      sx={{
                        maxWidth: '70%',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: chat.sender_id === user.id ? '#1976d2' : (darkMode ? '#3d3d3d' : '#f0f0f0'),
                        color: chat.sender_id === user.id ? '#fff' : (darkMode ? '#fff' : '#000'),
                      }}
                    >
                      {renderMessage(chat)}
                      <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.7 }}>
                        {formatTimestamp(chat.timestamp)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box className="p-4 flex" sx={{ borderTop: 1, borderColor: 'divider' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="mr-2"
                  InputProps={{
                    style: {
                      color: darkMode ? 'white' : 'black',
                      borderColor: darkMode ? 'white' : 'black',
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: darkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: darkMode ? 'white' : 'black',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: darkMode ? 'white' : 'black',
                      },
                    },
                  }}
                />
                <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                  <EmojiEmotionsIcon sx={{ color: darkMode ? 'white' : 'grey' }} />
                </IconButton>
                <IconButton onClick={() => fileInputRef.current.click()}>
                  <AttachFileIcon sx={{ color: darkMode ? 'white' : 'grey' }}/>
                </IconButton>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                />
                <IconButton onClick={handleSendMessage} color="primary">
                  <SendIcon />
                </IconButton>
              </Box>
              {showEmojiPicker && (
                <Box position="absolute" bottom="80px" right="20px" ref={emojiPickerRef}>
                  <Box display="flex" justifyContent="flex-end" mb={1}>
                    <IconButton size="small" onClick={() => setShowEmojiPicker(false)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </Box>
              )}
            </>
          ) : (
            <Typography variant="h6" className="p-4" sx={{ color: darkMode ? '#fff' : '#000' }}>
              Select a tutor to start chatting
            </Typography>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default StudentChatPage;