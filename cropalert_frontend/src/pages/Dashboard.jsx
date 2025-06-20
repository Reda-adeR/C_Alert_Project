import NavBar from '../components/NavBar';

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    // Dashboard component
    // dashboard with a navigation bar

    const [activeTab, setActiveTab] = useState('feed');
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.accessToken) {
            navigate('/login');
        }});

    return (
        <div>
            <NavBar onTabChange={setActiveTab} />

            {/* For now just show active tab */}
            <div className="p-6">
                <h2 className="text-xl font-semibold">Current Tab: {activeTab}</h2>
            </div>
        </div>
    );
}
