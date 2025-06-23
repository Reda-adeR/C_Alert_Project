import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { handleLogin } from '../api/auth';

import { AuthContext } from '../context/AuthContext';

import { useNavigate } from 'react-router-dom';

export default function Login() {
    // manage authentication state
    // login operation.
    // redirect after login.
    const { login, auth } = useContext(AuthContext);
    useEffect(() => {
    if (auth.accessToken) {
        navigate('/dashboard');
    }
    });
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    
    const handleChange = (e) => {
        setFormData({ 
        ...formData, 
        [e.target.name]: e.target.value 
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        // Call your login API here
        // console.log('Logging in with:', formData);
        const data = await handleLogin(formData);
        console.log('Login successful');
        
        login({
            accessToken: data.access,
            role: data.role,
        });
        navigate('/dashboard'); // Redirect to dashboard or home page after login
        // Handle success, e.g., redirect to dashboard
        } catch (err) {
        console.error('Login failed:', err);
        // Handle error, e.g., show an error message
        }
    };
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
            <h2 className="text-2xl font-bold text-center">Login</h2>
    
            <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.username}
            onChange={handleChange}
            required
            />
    
            <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={formData.password}
            onChange={handleChange}
            required
            />
    
            <button type="submit" className="w-full bg-blue-500 text-white rounded px-3 py-2 hover:bg-blue-600">
            Login
            </button>
            <Link to="/register" className="text-blue-500 hover:underline text-center block">
            Don't have an account? Register here
            </Link>
    
        </form>
        </div>
    );
    }