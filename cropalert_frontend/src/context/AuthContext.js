import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
console.log('AuthContext created');
export const AuthProvider = ({ children }) => {
    console.log('AuthProvider initialized');
    useEffect(() => {
  console.log('AuthContext useEffect rannnnnnn');
    }, []);
  const [auth, setAuth] = useState({
    accessToken: null,
    role: null
  });

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    if (token && role) {
      setAuth({ accessToken: token, role });
    }
  }, []);

  const login = ({ accessToken, role }) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('role', role);
    setAuth({ accessToken, role });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ accessToken: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};