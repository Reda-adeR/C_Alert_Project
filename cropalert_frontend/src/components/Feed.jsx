import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchAlertsFiltered } from '../api/alerts';
import InteractiveMap from './InteractiveMap';

export default function Feed({ setActiveTab, setHighlightedAlertId }) {
  const { auth, logout, isReady } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [filters, setFilters] = useState({ area: '', crops: '' });
  const [loading, setLoading] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);



  const loadAlerts = async () => {
    if (!auth.accessToken) {
      console.error('No access token found. Please log in.');
      return;
    }
    setLoading(true);
    try {
      const data = await fetchAlertsFiltered(auth.accessToken, logout, filters);
      setAlerts(data || []);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ⛔ DO NOT call `fetchAlertsFiltered` outside useEffect or handlers!

  // ✅ Load on first render only
  const seeOnMap = (alertId) => {
  setHighlightedAlertId(alertId);
  setActiveTab('map');  // Switch tab to Map view
  };
  useEffect(() => {
    if (isReady) {
      loadAlerts();
    }
  },[isReady]);

  return (
  <div className="p-6">
    {mapVisible ? (
        <InteractiveMap highlightedAlertId={highlightedId} />
    ) : (
      <>
        <h2 className="text-2xl font-bold mb-4">Alert Feed</h2>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Filter by area"
            className="border px-4 py-2 rounded w-full md:w-1/3"
            value={filters.area}
            onChange={(e) => setFilters({ ...filters, area: e.target.value })}
          />
          <input
            type="text"
            placeholder="Filter by crops"
            className="border px-4 py-2 rounded w-full md:w-1/3"
            value={filters.crops}
            onChange={(e) => setFilters({ ...filters, crops: e.target.value })}
          />
          <button
            onClick={loadAlerts}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Filter
          </button>
        </div>

        {loading ? (
          <p>Loading alerts...</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {alerts.length === 0 ? (
              <p className="text-gray-500 col-span-full">No alerts found.</p>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white shadow-md rounded p-4 border border-gray-200"
                >
                  <h3 className="text-xl font-semibold">{alert.title}</h3>
                  <p className="text-gray-600">{alert.description}</p>
                  <p className="text-sm mt-2">
                    📍 Lat: {alert.latitude}, Lng: {alert.longitude}
                  </p>
                  <p className="text-sm">🌍 Area: {alert.area}</p>
                  <p className="text-sm">🌾 Crops: {alert.crops}</p>
                  <p className="text-sm">🌾 Publisher: {alert.publisher}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    🕓 {new Date(alert.timestamp).toLocaleString()}
                  </p>
                  <button
                    onClick={() => seeOnMap(alert.id)}
                    className="mt-2 text-blue-600 hover:underline"
                  >
                    📌 See on map
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </>
    )}
  </div>
);}