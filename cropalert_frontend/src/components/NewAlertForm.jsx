import { useState, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';

import { createAlert } from '../api/alerts';
import AlertMap from './AlertMap';

export default function NewAlert() {

  const { auth, logout } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: '',
    description: '',
    area: '',
    crops: ''
  });
  const [coords, setCoords] = useState({ longitude: -5.0, latitude: 32.0 });
//   const [viewport, setViewport] = useState({
//     longitude: -5.0, // center Morocco
//     latitude: 32.0,
//     zoom: 5
//   });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
//   const handleMapClick = (event) => {
//     const { lng, lat } = event.lngLat;
//     setCoords({ longitude: lng, latitude: lat });
//   };

    const handleMapClick = useCallback(({ longitude, latitude }) => {
      setCoords({ longitude, latitude });
      }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);


    try {

        if (!coords.latitude || !coords.longitude)
            throw new Error('Please select a location on the map.');

      await createAlert({ ...form, ...coords }, auth.accessToken, logout);
      setSuccess('Alert published successfully');
      setForm({ title: '', description: '', area: '', crops: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2 text-center">Create New Alert</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows="2"
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Area *</label>
          <input
            type="text"
            name="area"
            value={form.area}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Crops *</label>
          <input
            type="text"
            name="crops"
            value={form.crops}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
        <label className="block font-semibold mb-2">Select location on the map *</label>
        <div className="w-full h-[250px] overflow-hidden rounded shadow border">
          <AlertMap 
            latitude={coords.latitude} 
            longitude={coords.longitude} 
            onMapClick={handleMapClick}
          />
        </div>
        {coords.latitude && coords.longitude && (
          <p className="text-sm text-gray-600 mt-1">
            Selected location - Latitude : {coords.latitude.toFixed(4)}, Longitude : {coords.longitude.toFixed(4)}
          </p>
        )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish Alert'}
        </button>
      </form>
    </div>
  );
}
