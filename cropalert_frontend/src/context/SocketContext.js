// src/context/WebSocketContext.js
import React, { createContext, useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from './AuthContext';

export const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const { auth, isReady } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isReady) return; // Wait until auth context is ready
    if (auth?.accessToken) {
      const ws = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${auth.accessToken}`);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessage(data.message);
        console.log('📩 Notification:', data.message);
      };

      ws.onclose = (e) => {
        console.log('❌ WebSocket closed', e.code, e.reason);
        // Don't log out here — reconnect handled by auth flow
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return () => {
        ws.close();
      };
    }

    // Optional: cleanup if no token
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [auth?.accessToken, isReady]);

  return (
    <WebSocketContext.Provider value={{ socket: socketRef.current, message }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
