

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

