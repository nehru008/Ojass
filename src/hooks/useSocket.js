
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

