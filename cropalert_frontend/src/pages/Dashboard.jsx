import NavBar from '../components/NavBar';
import NewAlertForm from '../components/NewAlertForm';
import Feed from '../components/Feed'; // (stub for now)

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('feed');
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.accessToken) {
      navigate('/login');
    }});

  const renderTabContent = () => {
    switch (activeTab) {
      case 'publish':
        return <NewAlertForm />;
      case 'feed':
        return <Feed />;
      case 'map':
        return <div>🗺️ Map view coming soon</div>;
      case 'notifications':
        return <div>🔔 Notification list</div>;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div>
      <NavBar onTabChange={setActiveTab} />
      <div className="p-6">{renderTabContent()}</div>
    </div>
  );
}

