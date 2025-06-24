import React, { createContext, useEffect, useState, useContext, useRef } from 'react';
import { AuthContext } from './AuthContext';

export const WebSocketContext = createContext();

const WebSocketProvider = ({ children }) => {
  const { auth, isReady } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const socketRef = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifiedAlertIds, setNotifiedAlertIds] = useState([]);


  useEffect(() => {
    if (!isReady || !auth?.accessToken) return;
    if (socketRef.current) return;
    if (auth?.accessToken) {
      const ws = new WebSocket(`ws://alert-crop-production.up.railway.app/ws/notifications/?token=${auth.accessToken}`);
      socketRef.current = ws;
      setSocket(ws);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsSocketReady(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Notification:', data);
        if (data.type === 'newNotif') {
          console.log('New notification received:', data.type);
          const alertId = data.message.alert_id;
          setNotifiedAlertIds(prev =>
            prev.includes(alertId) ? prev : [...prev, alertId]
          );
          // console.log('Notified Alert IDs:', notifiedAlertIds);
          setUnreadCount((prev) => prev + 1);
          setMessage(data.message);
        }
      };

      ws.onclose = (e) => {
        // console.log('WebSocket closed', e.code, e.reason);
        setIsSocketReady(false);
      };

      ws.onerror = (error) => {
        setIsSocketReady(false);
      };

      return () => {
        if (ws && ws.readyState === WebSocket.OPEN)
          ws.close();
        setSocket(null);
        socketRef.current = null;
        setIsSocketReady(false);

      };
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setSocket(null);
      }
    };
  }, [auth?.accessToken, isReady]);

  const resetUnreadCount = () => setUnreadCount(0);
  const clearNotifiedAlertIds = () => setNotifiedAlertIds([]);

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        message,
        unreadCount,
        resetUnreadCount,
        notifiedAlertIds,
        clearNotifiedAlertIds,
        isSocketReady
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
