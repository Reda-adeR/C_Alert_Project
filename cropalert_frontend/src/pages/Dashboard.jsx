import NavBar from '../components/NavBar';
import NewAlertForm from '../components/NewAlertForm';
import Feed from '../components/Feed';
import InteractiveMap from '../components/InteractiveMap';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { WebSocketContext } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('feed');
  const [highlightedAlertId, setHighlightedAlertId] = useState(-1);
  const [notifiedIdsForFeed, setNotifiedIdsForFeed] = useState([]);
  // setHighlightedAlertId(-1)
  const { auth } = useContext(AuthContext);
  // const { isSocketReady, unreadCount, resetUnreadCount } = useContext(WebSocketContext);
  // console.log('WebSocket is ready:', isSocketReady);
  const wsContext = useContext(WebSocketContext);

  const unreadCount = wsContext?.unreadCount ?? 0;
  const resetUnreadCount = wsContext?.resetUnreadCount ?? (() => {});
  const arrayOfNotifiedAlertIds = wsContext?.notifiedAlertIds ?? [];
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
  const handleTabChange = (tab) => {
    if (tab === 'notifications') {
      if (arrayOfNotifiedAlertIds.length === 0) return;
      console.log('notf ids for feed:', arrayOfNotifiedAlertIds);
      if (activeTab === 'feed') {
        setActiveTab('');
      }
      setNotifiedIdsForFeed(arrayOfNotifiedAlertIds);
      resetUnreadCount();
      setTimeout(() => { 
        setActiveTab('feed')
        wsContext.clearNotifiedAlertIds(); 
      }, 0);
    } else {
      setActiveTab(tab);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'publish':
        return <NewAlertForm />;
      case 'feed':
        return <Feed setActiveTab={setActiveTab}
                    setHighlightedAlertId={setHighlightedAlertId}
                    notifiedIds={notifiedIdsForFeed}
              />;
      case 'map':
        return <InteractiveMap highlightedAlertId={highlightedAlertId} />;
      default:
        return <div>loading...</div>;
    }
  };

  return (
    <div>
      <NavBar onTabChange={handleTabChange}
              
              unreadCount={unreadCount}
              resetUnreadCount={resetUnreadCount}
       />
      <div className="p-6">{renderTabContent()}</div>
    </div>
  );
}

