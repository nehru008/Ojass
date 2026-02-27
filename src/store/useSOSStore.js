

// src/store/useSOSStore.js
import { create } from 'zustand';

/**
 * SOS Store - Manages the active SOS state
 */
const useSOSStore = create((set, get) => ({
  active: false,
  id: null,
  type: 'Medical Emergency',
  location: null,
  resolved: false,
  timestamp: null,
  anonymous: false,
  notes: '',

  // Trigger a new SOS
  triggerSOS: (data) => set({
    active: true,
    id: data.id,
    type: data.type,
    location: data.location,
    anonymous: data.anonymous,
    notes: data.notes,
    timestamp: Date.now(),
    resolved: false,
  }),

  // Resolve active SOS
  resolveSOS: () => set({
    active: false,
    resolved: true,
    id: null,
  }),

  // Reset SOS state
  resetSOS: () => set({
    active: false,
    id: null,
    type: 'Medical Emergency',
    location: null,
    resolved: false,
    timestamp: null,
    anonymous: false,
    notes: '',
  }),

  // Set SOS type
  setType: (type) => set({ type }),
  setAnonymous: (val) => set({ anonymous: val }),
  setNotes: (notes) => set({ notes }),
}));

export default useSOSStore;
