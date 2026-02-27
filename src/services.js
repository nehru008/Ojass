import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

export const sosService = {
  sendSOS: (data) => api.post('/sos', data),
};

export const aiService = {
  query: (prompt) => api.post('/ai', { prompt }),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
};

export default api;

// src/services/api.js
import axios from 'axios';

/**
 * Base Axios instance with backend URL from env
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token if exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nearhelp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - normalize errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;


// ==========================================

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


// ==========================================

// src/services/aiService.js
import api from './api';

const GUIDANCE_DATA = {
  'Medical Emergency': {
    steps: ['Call 911 immediately', 'Check breathing & pulse', 'Begin CPR if unresponsive', 'Use AED if available', 'Stay until help arrives'],
    summary: 'Medical emergency detected. A certified responder is nearby. Keep patient still and calm. Monitor vitals.',
    severity: 'HIGH',
  },
  'Fire': {
    steps: ['Evacuate building immediately', 'Alert all occupants', 'Call 911', 'Do NOT use elevators', 'Meet at designated assembly point'],
    summary: 'Fire emergency reported. Evacuation protocol active. Fire station dispatched. Keep all exits clear.',
    severity: 'CRITICAL',
  },
  'Gas Leak': {
    steps: ['Evacuate area immediately', 'Do NOT use electrical switches', 'Do NOT ignite flames', 'Call gas company & 911', 'Ventilate if safe'],
    summary: 'Suspected gas leak. Utility company notified. Maintain 200m clear radius. Do not operate electronics.',
    severity: 'HIGH',
  },
  'Accident': {
    steps: ['Ensure scene safety first', 'Call 911 immediately', 'Do not move injured persons', 'Provide basic first aid', 'Direct traffic safely'],
    summary: 'Vehicle accident reported. EMS dispatched. Nearby responder with First Aid approaching.',
    severity: 'MEDIUM',
  },
  'Other': {
    steps: ['Assess the situation', 'Call appropriate services', 'Keep bystanders back', 'Document details', 'Cooperate with responders'],
    summary: 'Emergency situation reported. Analyzing appropriate response. Stay alert and safe.',
    severity: 'MEDIUM',
  },
};

/**
 * AI/Crisis Assistant Service
 */
const aiService = {
  /**
   * Get AI-generated first-response guidance
   * POST /api/ai/guidance
   */
  getGuidance: async (type) => {
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 1200));
      return GUIDANCE_DATA[type] || GUIDANCE_DATA['Other'];
    }
    return api.post('/api/ai/guidance', { type });
  },

  /**
   * Submit post-resolution feedback
   * POST /api/ai/feedback
   */
  submitFeedback: async (sosId, feedback) => {
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 400));
      return { submitted: true };
    }
    return api.post('/api/ai/feedback', { sosId, feedback });
  },

  /**
   * Get emergency summary (for admin)
   * GET /api/ai/summary/:sosId
   */
  getSummary: async (sosId) => {
    return api.get(`/api/ai/summary/${sosId}`);
  },
};

export default aiService;


// ==========================================

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
