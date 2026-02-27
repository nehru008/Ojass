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

