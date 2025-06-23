import React, { useState, useEffect, useRef, useContext } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import { fetchAlerts } from '../api/alerts';
import { AuthContext } from '../context/AuthContext';
import 'mapbox-gl/dist/mapbox-gl.css';

const token = 'pk.eyJ1IjoidXNlcmFub255bWUzMTciLCJhIjoiY21jNnRobnR6MHFvYTJtczl0eXB4Y3hneCJ9.0JUrXjCEpFf9IyUItCZkCg'; // Replace if needed
const MOROCCO_BOUNDS = {
  minLng: -17.5,
  minLat: 20.0,
  maxLng: -0.5,
  maxLat: 36.0
};

export default function InteractiveMap({ highlightedAlertId }) {
  const { auth, logout } = useContext(AuthContext);
  const [alerts, setAlerts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: -5.0,
    latitude: 32.0,
    zoom: 6
  });

  const mapRef = useRef(null);

  useEffect(() => {
    if (!auth.accessToken) return;

    fetchAlerts(auth.accessToken, logout).then(setAlerts);
  }, [auth.accessToken, logout]);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = mapRef.current.getMap();
    map.setMaxBounds([
      [MOROCCO_BOUNDS.minLng, MOROCCO_BOUNDS.minLat],
      [MOROCCO_BOUNDS.maxLng, MOROCCO_BOUNDS.maxLat]
    ]);
    map.setMinZoom(5);
    map.setMaxZoom(12);
    map.touchZoomRotate.disableRotation();
  }, [mapLoaded]);


  useEffect(() => {
  if (highlightedAlertId && alerts.length > 0) {
    const alertToHighlight = alerts.find(alert => alert.id === highlightedAlertId);
    if (alertToHighlight) {
      setSelected(alertToHighlight);
      setViewState((prev) => ({
        ...prev,
        longitude: alertToHighlight.longitude,
        latitude: alertToHighlight.latitude,
        zoom: 8
      }));
    }
  }
}, [highlightedAlertId, alerts]);

  return (
    <div className="w-full h-[80vh] relative rounded overflow-hidden shadow">
      <Map
        ref={mapRef}
        {...viewState}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={token}
        onLoad={() => setMapLoaded(true)}
        onMove={(evt) => {
          const { longitude, latitude } = evt.viewState;
          setViewState({
            ...evt.viewState,
            longitude: Math.max(MOROCCO_BOUNDS.minLng, Math.min(MOROCCO_BOUNDS.maxLng, longitude)),
            latitude: Math.max(MOROCCO_BOUNDS.minLat, Math.min(MOROCCO_BOUNDS.maxLat, latitude))
          });
        }}
        onClick={() => setSelected(null)}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />

        {alerts.map((alert) => (
          <Marker
            key={alert.id}
            longitude={alert.longitude}
            latitude={alert.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setSelected(alert);
            }}
          >
            <div className={`text-2xl ${alert.id === highlightedAlertId ? 'animate-bounce text-red-600' : 'text-green-600'}`}>
              📍
            </div>
          </Marker>
        ))}

        {selected && (
          <Popup
            longitude={selected.longitude}
            latitude={selected.latitude}
            onClose={() => setSelected(null)}
            closeOnClick={false}
          >
            <div className="text-sm">
              <strong>Title : {selected.title}</strong><br />
              Description : {selected.description}
                <br />
              Publisher :   {selected.publisher}
                <br />
                Created at : {new Date(selected.timestamp).toLocaleDateString('en-US')}
            </div>
          </Popup>
        )}
      </Map>

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          Loading map...
        </div>
      )}
    </div>
  );
}
