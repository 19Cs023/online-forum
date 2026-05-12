import { create } from 'zustand';

// Helper to reliably get the initial user from local storage
const getInitialUser = () => {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
        return null;
      }
    }
  }
  return null;
};

// Create a global auth store using Zustand
const useAuthStore = create((set) => ({
  user: getInitialUser(),
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  
  // Action to log a user in
  login: (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    set({ user: userData, token });
  },
  
  // Action to log a user out
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;