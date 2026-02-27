
// src/store/useMapStore.js
import { create } from 'zustand';

/**
 * Map Store - Manages map state, markers, and locations
 */
const useMapStore = create((set, get) => ({
  userLocation: { lat: 40.7128, lng: -74.006 }, // NYC default
  locationDetected: false,
  sosList: [],
  responders: [],

  // Location
  setUserLocation: (lat, lng) => set({ userLocation: { lat, lng }, locationDetected: true }),

  // SOS markers
  addSOS: (sos) => set((state) => ({ sosList: [...state.sosList, sos] })),
  removeSOS: (id) => set((state) => ({ sosList: state.sosList.filter(s => s.id !== id) })),
  clearSOS: () => set({ sosList: [] }),

  // Responder markers
  addResponder: (responder) => set((state) => ({
    responders: [...state.responders, responder],
  })),
  updateResponderLocation: (id, lat, lng) => set((state) => ({
    responders: state.responders.map(r => r.id === id ? { ...r, lat, lng } : r),
  })),
  removeResponder: (id) => set((state) => ({
    responders: state.responders.filter(r => r.id !== id),
  })),
  clearResponders: () => set({ responders: [] }),
}));

export default useMapStore;
