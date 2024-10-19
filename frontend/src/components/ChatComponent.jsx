import React, { useState, useEffect, useRef } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

const ChatComponent = ({ roomName }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new ReconnectingWebSocket(`wss://api.mxedulearners.online/ws/chat/${roomName}/`);

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    return () => {
      socketRef.current.close();
    };
  }, [roomName]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage) {
      socketRef.current.send(JSON.stringify({ message: inputMessage }));
      setInputMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4">Chat Room: {roomName}</h2>
      <div className="h-64 overflow-y-auto mb-4 p-2 border border-gray-300 rounded">
        {messages.map((message, index) => (
          <p key={index} className="mb-2">{message}</p>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;