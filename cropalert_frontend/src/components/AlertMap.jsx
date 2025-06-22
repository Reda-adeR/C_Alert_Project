import React, { useState, useCallback, useEffect, useRef } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';




const token = "pk.eyJ1IjoidXNlcmFub255bWUzMTciLCJhIjoiY21jNnRobnR6MHFvYTJtczl0eXB4Y3hneCJ9.0JUrXjCEpFf9IyUItCZkCg";

const MOROCCO_BOUNDS = {
  minLng: -17.5,
  minLat: 20.0,
  maxLng: -0.5,
  maxLat: 36.0
};


const AlertMap = ({ latitude, longitude, onMapClick }) => {

  const mapRef = useRef(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: -5.0,  // Default center (Morocco)
    latitude: 32.0,
    zoom: 5
  });
  // Initialize with props once map is loaded
  useEffect(() => {
    if (mapLoaded && latitude && longitude) {
      setViewState({
        longitude,
        latitude,
        zoom: 12  // Closer zoom when we have specific coordinates
      });
    }
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      
      // Restrict view to Morocco
      map.setMaxBounds([
        [MOROCCO_BOUNDS.minLng, MOROCCO_BOUNDS.minLat], // SW
        [MOROCCO_BOUNDS.maxLng, MOROCCO_BOUNDS.maxLat]  // NE
      ]);
      
      // Limit zoom levels
      map.setMinZoom(5);
      map.setMaxZoom(12);
      
      // Disable rotation
      map.touchZoomRotate.disableRotation();
    }
  }, [mapLoaded, latitude, longitude]);

  const handleClick = useCallback((e) => {

    if (e.lngLat.lng < MOROCCO_BOUNDS.minLng || 
        e.lngLat.lng > MOROCCO_BOUNDS.maxLng ||
        e.lngLat.lat < MOROCCO_BOUNDS.minLat || 
        e.lngLat.lat > MOROCCO_BOUNDS.maxLat) {
      return;
    }

    setViewState(prev => ({
      ...prev,
      longitude: e.lngLat.lng,
      latitude: e.lngLat.lat
    }));
    onMapClick({
      longitude: e.lngLat.lng,
      latitude: e.lngLat.lat
    });
  }, [onMapClick]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map
        {...viewState}
        ref={mapRef}
        onLoad={() => setMapLoaded(true)}
        onMove={
            (evt) => {
          // Enforce boundaries during movement
          let { longitude, latitude } = evt.viewState;
          
          longitude = Math.max(MOROCCO_BOUNDS.minLng, 
                    Math.min(MOROCCO_BOUNDS.maxLng, longitude));
          latitude = Math.max(MOROCCO_BOUNDS.minLat, 
                    Math.min(MOROCCO_BOUNDS.maxLat, latitude));
          
          setViewState({
            ...evt.viewState,
            longitude,
            latitude
          });
        }}
        onClick={handleClick}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={token}
        style={{ width: '100%', height: '100%' }}
        reuseMaps={true}
      >
        {mapLoaded && latitude && longitude && (
          <Marker
            longitude={longitude}
            latitude={latitude}
            color="red"
            draggable
            onDragEnd={handleClick}
          />
        )}
        <NavigationControl position="top-right" />
      </Map>
      
      {!mapLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          Loading map...
        </div>
      )}
    </div>
  );
};

export default AlertMap;