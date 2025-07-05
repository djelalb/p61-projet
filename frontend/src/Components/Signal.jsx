import { useState } from 'react';

import * as API from '../lib/API';

export default function Signal({ onClose }) {
  const [closingTarget, setClosingTarget] = useState(null);

  const handleClose = (e) => {
    if (e.currentTarget === closingTarget) {
      onClose();
    }
  };

  const handleSignal = (e) => {
    e.preventDefault();

    if (!navigator.geolocation) return window.alert('Géolocalisation impossible');

    navigator.geolocation.getCurrentPosition((geoloc) => {
      API.signal(geoloc.coords.latitude, geoloc.coords.longitude)
        .then(onClose)
        .catch(() => {
          window.alert('Erreur lors du signalement');
        });
    });
  };

  return (
    <div
      className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black bg-opacity-50 z-9999"
      onClick={handleClose}
      onMouseDown={(e) => setClosingTarget(e.target)}
    >
      <button onClick={handleSignal}>Signaler</button>
    </div>
  );
}
