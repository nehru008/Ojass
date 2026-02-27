// src/socket/socketClient.js
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

let socketInstance = null;

/**
 * Returns a singleton socket.io client instance.
 * Socket is only created once and reused.
 */
export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance?.connected) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export default getSocket;


// ==========================================

// src/hooks/useSocket.js
import { useEffect, useRef, useCallback } from 'react';
import { getSocket } from '../socket/socketClient';
import useMapStore from '../store/useMapStore';
import useChatStore from '../store/useChatStore';

/**
 * useSocket - Custom hook to manage WebSocket connections
 * Handles all socket events and syncs state to Zustand stores
 */
const useSocket = (sosId = null) => {
  const socketRef = useRef(null);
  const { addResponder, updateResponderLocation, removeResponder, removeSOS } = useMapStore();
  const { addMessage } = useChatStore();

  const connect = useCallback(() => {
    const socket = getSocket();
    socketRef.current = socket;

    if (!socket.connected) {
      socket.connect();
    }

    // === RESPONDER EVENTS ===
    socket.on('responder:joined', (data) => {
      console.log('[Socket] Responder joined:', data);
      addResponder({
        id: data.id,
        name: data.name,
        skills: data.skills,
        lat: data.lat,
        lng: data.lng,
        eta: data.eta,
      });
    });

    socket.on('responder:location', (data) => {
      updateResponderLocation(data.id, data.lat, data.lng);
    });

    socket.on('responder:left', (data) => {
      removeResponder(data.id);
    });

    // === SOS EVENTS ===
    socket.on('sos:resolved', (data) => {
      removeSOS(data.sosId);
    });

    socket.on('sos:new', (data) => {
      // Incoming SOS for responders
      console.log('[Socket] New SOS:', data);
    });

    // === CHAT EVENTS ===
    socket.on('chat:message', (msg) => {
      addMessage({ ...msg, own: false });
    });

    // === CONNECTION ===
    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
      if (sosId) {
        socket.emit('sos:join_room', { sosId });
      }
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
    });

  }, [sosId]);

  const disconnect = useCallback(() => {
    const socket = socketRef.current;
    if (socket) {
      socket.off('responder:joined');
      socket.off('responder:location');
      socket.off('responder:left');
      socket.off('sos:resolved');
      socket.off('sos:new');
      socket.off('chat:message');
      socket.disconnect();
    }
  }, []);

  const emit = useCallback((event, data) => {
    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit(event, data);
    } else {
      console.warn('[Socket] Not connected, cannot emit:', event);
    }
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (socketRef.current) {
        disconnect();
      }
    };
  }, []);

  return { connect, disconnect, emit, socket: socketRef.current };
};

export default useSocket;


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
