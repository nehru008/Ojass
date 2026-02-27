

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
