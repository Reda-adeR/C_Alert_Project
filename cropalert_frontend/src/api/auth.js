// src/api/auth.js

const API_BASE = 'http://localhost:8000/api';

export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE}/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw data; // fail
    }

    return data; // success
  } catch (error) {
    throw error; // Error registering user
  }
}

export const handleLogin = async (userIds) => {
  const response = await fetch(`${API_BASE}/login/`, {
    method: 'POST',
    body: JSON.stringify(userIds),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await response.json();

    if (!response.ok) {
      // Handle login error
      console.error('Login failed:', data);
      throw new Error(data.message || 'Login failed');
    }
    // Handle successful login
    console.log('Login successful:', data);
    if (!data.access || !data.refresh) {
        throw new Error('Missing access or refresh token in response');
        }
    // Assuming data contains access_token, refresh_token, and role
    console.log('Access Token:', data.access);
    console.log('Refresh Token:', data.refresh);
    console.log('Role:', data.role);

  // Save to localStorage or state (minimum logic)
  localStorage.setItem('accessToken', data.access);
  localStorage.setItem('refreshToken', data.refresh);
  localStorage.setItem('role', data.role);
};