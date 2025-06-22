

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