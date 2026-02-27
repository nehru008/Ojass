
// ==========================================

// src/hooks/useGeolocation.js
import { useState, useEffect, useCallback } from 'react';
import useMapStore from '../store/useMapStore';

/**
 * useGeolocation - Detects and watches the user's location
 * Updates the map store with current coordinates
 */
const useGeolocation = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setUserLocation, userLocation, locationDetected } = useMapStore();

  const detect = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation(pos.coords.latitude, pos.coords.longitude);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        // Fall back to NYC
        setUserLocation(40.7128, -74.006);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, [setUserLocation]);

  // Watch for location updates
  const watchLocation = useCallback(() => {
    if (!navigator.geolocation) return null;
    return navigator.geolocation.watchPosition(
      (pos) => setUserLocation(pos.coords.latitude, pos.coords.longitude),
      (err) => console.warn('[Geo watch error]', err),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
  }, [setUserLocation]);

  useEffect(() => {
    detect();
  }, []);

  return { loading, error, userLocation, locationDetected, detect };
};

export default useGeolocation;

