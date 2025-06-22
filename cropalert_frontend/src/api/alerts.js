

const API_BASE = 'http://localhost:8000';


export async function createAlert(alertData, accessToken, logout) {

    if (!accessToken) {
        throw new Error('Access token is required to create an alert');
    }
    
    const response = await fetch(`${API_BASE}/alerts/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(alertData)
    });
    
    const data = await response.json();
    
    if (response.status === 401) {
      logout();
      throw new Error('Unauthorized. Please log in again.');
    }
    if (!response.ok) {
    throw new Error(data.detail || 'Failed to publish alert');
  }
//   console.log("-------------response status-------------", response.status);
  if (response.status === 403) {
    throw new Error('Forbidden. You do not have permission to create alerts.');
  }

  return data;
}


// src/api/alerts.js
export async function fetchAlerts(accessToken, logout) {
  try {
    const response = await fetch(`${API_BASE}/alerts/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (response.status === 401) {
      logout();  // Token expired or invalid
      return [];
    }

    if (!response.ok) throw new Error('Failed to fetch alerts');

    // console.log("-------------response-------------", response.json().then(data => console.log(data)));
    return await response.json();
  } catch (err) {
    console.error('Error fetching alerts:', err);
    return [];
  }
}


export const fetchAlertsFiltered = async (accessToken, logout, filters = {}) => {
  const query = new URLSearchParams();
  if (filters.area) query.append('area', filters.area);
  if (filters.crops) query.append('crops', filters.crops);

  try {
    const response = await fetch(`${API_BASE}/alerts/filter/?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (response.status === 401) {
      logout();
      throw new Error('Unauthorized');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
    throw error;
  }
};