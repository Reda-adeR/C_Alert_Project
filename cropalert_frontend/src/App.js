import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import WebSocketProvider from './context/SocketContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
  const { auth } = useContext(AuthContext);

  const routes = (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );

  return auth.accessToken ? (
    <WebSocketProvider>{routes}</WebSocketProvider>
  ) : (
    routes
  );
}
