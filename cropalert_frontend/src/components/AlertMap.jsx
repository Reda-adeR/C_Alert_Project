// src/components/AlertMap.jsx
import React from 'react';

export default function AlertMap({ latitude, longitude }) {
  const zoom = 12;
  const width = 600;
  const height = 300;
  const apiKey = 'AIzaSyA42HrfShALdPgW9GAageag6_inX89v51I'; // 🔐 replace with your key

  if (!latitude || !longitude) {
    return <p className="text-gray-500">📍 Select a location to see map preview.</p>;
  }

  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=${zoom}&size=${width}x${height}&markers=color:red|${latitude},${longitude}&key=${apiKey}`;

  return (
    <div className="rounded shadow border overflow-hidden max-w-full">
        zen
      <img
        src={mapUrl}
        alt="Location preview"
        className="w-full h-auto"
      />
    </div>
  );
}
