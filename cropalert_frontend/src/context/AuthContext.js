import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
// console.log('AuthContext created');
export const AuthProvider = ({ children }) => {
    // console.log('AuthProvider initialized');
    useEffect(() => {
  // console.log('AuthContext useEffect rannnnnnn');
    }, []);
  const [auth, setAuth] = useState({
    accessToken: null,
    role: null
  });
  const [isReady, setIsReady] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');
    if (token && role) {
      setAuth({ accessToken: token, role });
    }
    setIsReady(true);
  }, []);

  const login = ({ accessToken, role }) => {
    setAuth({ accessToken, role });
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('role', role);
  };

  const logout = () => {
    console.log("Logging out...");
    setAuth({ accessToken: null, role: null });
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  );
};