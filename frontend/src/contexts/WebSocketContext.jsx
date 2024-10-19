import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMessage, addNotification } from '../store/tutorChatSlice';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      const newSocket = new WebSocket(`wss://api.mxedulearners.online/ws/user/${user.id}/`);

      newSocket.onopen = () => {
        console.log('WebSocket connection established');
      };
      newSocket.onerror = (error) => console.log('Error:', error);
      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chat_message') {
          dispatch(addMessage({
            roomName: data.room_name,
            message: {
              id: data.id,
              message: data.message,
              sender_id: data.sender_id,
              receiver_id: data.receiver_id,
              timestamp: data.timestamp,
              message_type: data.message_type,
              file_type: data.file_type
            }
          }));
        } else if (data.type === 'notification') {
          dispatch(addNotification(data.notification));
        }
      };

      newSocket.onclose = () => {
        console.log('WebSocket connection closed');
      };

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user, dispatch]);

  const sendMessage = (messageData) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(
        {
          type: 'chat_message',
          ...messageData
        }
        ));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};