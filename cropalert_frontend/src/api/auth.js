
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
      throw data; //failure response
    }

    return data; //success response
  } catch (error) {
    throw error;
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
      console.error('Login failed:', data);
      throw new Error(data.message || 'Login failed');
    }
    console.log('Login successful:', data);
    if (!data.access || !data.refresh) {
        throw new Error('Missing access or refresh token in response');
        }

  localStorage.setItem('accessToken', data.access);
  localStorage.setItem('refreshToken', data.refresh);
  localStorage.setItem('role', data.role);

    return data;
};