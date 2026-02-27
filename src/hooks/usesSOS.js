
// ==========================================

// src/hooks/useSOS.js
import { useState, useCallback } from 'react';
import useSOSStore from '../store/useSOSStore';
import useMapStore from '../store/useMapStore';
import sosService from '../services/sosService';
import useSocket from './useSocket';

/**
 * useSOS - Manages SOS trigger and resolution flow
 */
const useSOS = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { triggerSOS, resolveSOS, active, type, location, anonymous, notes, id } = useSOSStore();
  const { addSOS, removeSOS, userLocation } = useMapStore();
  const { connect, emit } = useSocket();

  /**
   * Send SOS alert to backend and start socket connection
   */
  const sendSOS = useCallback(async ({ type, anonymous, notes }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await sosService.triggerSOS({
        type,
        location: userLocation,
        anonymous,
        notes,
      });

      // Update stores
      triggerSOS({ ...result, type, location: userLocation, anonymous, notes });
      addSOS({ id: result.id, type, lat: userLocation.lat, lng: userLocation.lng });

      // Start socket
      connect();
      emit('sos:trigger', { sosId: result.id, type, location: userLocation });

      return result;
    } catch (err) {
      setError(err.message || 'Failed to send SOS');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userLocation, triggerSOS, addSOS, connect, emit]);

  /**
   * Resolve active SOS
   */
  const resolve = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      await sosService.resolveSOS(id);
      resolveSOS();
      removeSOS(id);
      emit('sos:resolved', { sosId: id });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, resolveSOS, removeSOS, emit]);

  return {
    loading, error,
    active, type, location, anonymous, id,
    sendSOS, resolve,
  };
};

export default useSOS;
