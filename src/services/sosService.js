// src/services/sosService.js
import api from './api';

/**
 * SOS API Service
 */
const sosService = {
  /**
   * Trigger a new SOS alert
   * POST /api/sos/trigger
   */
  triggerSOS: async (data) => {
    // In demo mode, return mock data
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 800));
      return { id: 'sos_' + Date.now(), ...data, status: 'active', createdAt: new Date().toISOString() };
    }
    return api.post('/api/sos/trigger', data);
  },

  /**
   * Resolve an active SOS
   * PATCH /api/sos/:id/resolve
   */
  resolveSOS: async (id) => {
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 400));
      return { id, status: 'resolved' };
    }
    return api.patch(`/api/sos/${id}/resolve`);
  },

  /**
   * Get all active SOS (for admin/map)
   * GET /api/sos/active
   */
  getActiveSOS: async () => {
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 500));
      return [
        { id: 'sos_demo1', type: 'Medical Emergency', lat: 40.717, lng: -73.998, timestamp: Date.now() - 120000 },
        { id: 'sos_demo2', type: 'Accident', lat: 40.705, lng: -74.012, timestamp: Date.now() - 600000 },
      ];
    }
    return api.get('/api/sos/active');
  },

  /**
   * Report/flag a misuse SOS
   * POST /api/sos/:id/flag
   */
  flagSOS: async (id, reason) => {
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 300));
      return { flagged: true };
    }
    return api.post(`/api/sos/${id}/flag`, { reason });
  },
};

export default sosService;

