import React, { createContext, useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from './AuthContext';

export const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const { auth, isReady } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [socket, setSocket] = useState(null); // 👈 trigger re-renders when changed
  const [isSocketReady, setIsSocketReady] = useState(false);
  const socketRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isReady) return;

    if (auth?.accessToken) {
      const ws = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${auth.accessToken}`);
      socketRef.current = ws;
      setSocket(ws); // 👈 update state so consumers get latest socket

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        setIsSocketReady(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('📩 Notification:', data);
        if (data.type === 'newNotif') {
          console.log('New notification received:', data.type);
          setUnreadCount((prev) => prev + 1);
          setMessage(data.message);
        }
      };

      ws.onclose = (e) => {
        console.log('❌ WebSocket closed', e.code, e.reason);
        setIsSocketReady(false);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsSocketReady(false);
      };

      return () => {
        ws.close();
        setSocket(null); // 👈 clear socket when closed
        socketRef.current = null; // 👈 clear ref when closed
        setIsSocketReady(false); // 👈 reset ready state

      };
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setSocket(null); // 👈 clear socket on cleanup
      }
    };
  }, [auth?.accessToken, isReady]);

  const resetUnreadCount = () => setUnreadCount(0);

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        message,
        unreadCount,
        resetUnreadCount,
        isSocketReady
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
