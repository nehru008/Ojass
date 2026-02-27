

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


// src/store/useUserStore.js
import { create } from 'zustand';

/**
 * User Store - Manages user profile and responder state
 */
const useUserStore = create((set, get) => ({
  id: 'user_' + Math.random().toString(36).slice(2, 8),
  name: 'Alex Rivera',
  anonymous: false,
  skills: ['CPR', 'First Aid'],
  isResponder: false,
  respondingTo: null,
  rating: 4.9,
  totalResponses: 12,

  // Skill management
  addSkill: (skill) => set((state) => ({
    skills: state.skills.includes(skill) ? state.skills : [...state.skills, skill],
  })),
  removeSkill: (skill) => set((state) => ({
    skills: state.skills.filter(s => s !== skill),
  })),
  toggleSkill: (skill) => {
    const { skills } = get();
    if (skills.includes(skill)) get().removeSkill(skill);
    else get().addSkill(skill);
  },

  // Responder state
  startResponding: (sosId) => set({ isResponder: true, respondingTo: sosId }),
  stopResponding: () => set({ isResponder: false, respondingTo: null }),

  // Profile
  setName: (name) => set({ name }),
  toggleAnonymous: () => set((state) => ({ anonymous: !state.anonymous })),
}));

export default useUserStore;


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


// src/store/useChatStore.js
import { create } from 'zustand';

/**
 * Chat Store - Manages real-time chat messages
 */
const useChatStore = create((set) => ({
  messages: [],
  isOpen: false,
  unreadCount: 0,

  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, msg],
    unreadCount: state.isOpen ? 0 : state.unreadCount + 1,
  })),

  clearMessages: () => set({ messages: [], unreadCount: 0 }),
  openChat: () => set({ isOpen: true, unreadCount: 0 }),
  closeChat: () => set({ isOpen: false }),
}));

export default useChatStore;
