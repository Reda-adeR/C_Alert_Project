import NavBar from '../components/NavBar';
import NewAlertForm from '../components/NewAlertForm';
import Feed from '../components/Feed'; // (stub for now)
import InteractiveMap from '../components/InteractiveMap';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { WebSocketContext } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('feed');
  const [highlightedAlertId, setHighlightedAlertId] = useState(-1);
  // setHighlightedAlertId(-1)
  const { auth } = useContext(AuthContext);
  // const { isSocketReady, unreadCount, resetUnreadCount } = useContext(WebSocketContext);
  // console.log('WebSocket is ready:', isSocketReady);
  const wsContext = useContext(WebSocketContext);

  const unreadCount = wsContext?.unreadCount ?? 0;
  const resetUnreadCount = wsContext?.resetUnreadCount ?? (() => {});
  // const isSocketReady = wsContext?.isSocketReady ?? false;
  // console.log('Unread count:', unreadCount);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!auth.accessToken) {
      navigate('/login');
    }});
    
    // if (!isSocketReady) {
    //   console.log('WebSocket is not ready yet');
    //   return null; // or some loading indicator
    // }
    
  const renderTabContent = () => {
    switch (activeTab) {
      case 'publish':
        return <NewAlertForm />;
      case 'feed':
        return <Feed setActiveTab={setActiveTab}
                    setHighlightedAlertId={setHighlightedAlertId}
              />;
      case 'map':
        return <InteractiveMap highlightedAlertId={highlightedAlertId} />; // Assuming InteractiveMap is the map component
      case 'notifications':
        return <Feed />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div>
      <NavBar onTabChange={setActiveTab}
              unreadCount={unreadCount}
              resetUnreadCount={resetUnreadCount}
       />
      <div className="p-6">{renderTabContent()}</div>
    </div>
  );
}

