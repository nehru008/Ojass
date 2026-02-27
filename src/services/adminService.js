// src/services/adminService.js
import api from './api';

/**
 * Admin Dashboard Service
 */
const adminService = {
  getStats: async () => {
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 600));
      return { activeSOS: 7, totalToday: 24, avgResponseTime: '3m 42s', resolvedToday: 17 };
    }
    return api.get('/api/admin/stats');
  },

  getAllSOS: async () => {
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 700));
      return [
        { id: '#SOS001', type: 'Medical Emergency', location: '40.712, -74.006', time: '14:32', responders: 2, status: 'Active' },
        { id: '#SOS002', type: 'Accident', location: '40.718, -73.997', time: '14:25', responders: 1, status: 'Active' },
        { id: '#SOS003', type: 'Fire', location: '40.705, -74.012', time: '14:18', responders: 3, status: 'Responding' },
        { id: '#SOS004', type: 'Gas Leak', location: '40.720, -74.001', time: '14:10', responders: 0, status: 'Unresponded' },
      ];
    }
    return api.get('/api/admin/sos');
  },

  flagSOS: async (id) => {
    if (import.meta.env.DEV) return { flagged: true };
    return api.post(`/api/admin/sos/${id}/flag`);
  },

  resolveSOSAdmin: async (id) => {
    if (import.meta.env.DEV) return { resolved: true };
    return api.patch(`/api/admin/sos/${id}/resolve`);
  },
};

export default adminService;
