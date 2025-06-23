import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';

import { BrowserRouter as Router } from 'react-router-dom'
// import Register from './pages/Register.jsx'
// import Login from './pages/Login.jsx'
// import Dashboard from './pages/Dashboard.jsx'
import './index.css';
import { AuthProvider } from './context/AuthContext.js';
// import { WebSocketProvider } from './context/SocketContext.js';
import App from './App.js';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </React.StrictMode>
);


