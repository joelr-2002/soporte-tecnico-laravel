import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, LoginCredentials, RegisterData, UpdateProfileData, ChangePasswordData } from '../types';
import api from '../services/api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;

  // Auth methods
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;

  // Profile methods
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  uploadPhoto: (file: File) => Promise<void>;

  // Password reset
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: { token: string; email: string; password: string; password_confirmation: string }) => Promise<void>;

  // Utils
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('auth_token', token);
        } else {
          localStorage.removeItem('auth_token');
        }
      },
      setLoading: (isLoading) => set({ isLoading }),

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/login', credentials);
          const { user, token } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
          localStorage.setItem('auth_token', token);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/register', data);
          const { user, token } = response.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
          localStorage.setItem('auth_token', token);
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await api.post('/logout');
        } catch (error) {
          // Continue with logout even if API call fails
          console.error('Logout API error:', error);
        } finally {
          get().clearAuth();
          set({ isLoading: false });
        }
      },

      fetchUser: async () => {
        const token = get().token || localStorage.getItem('auth_token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await api.get('/user');
          set({
            user: response.data.user || response.data,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          get().clearAuth();
          set({ isLoading: false });
          throw error;
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const formData = new FormData();
          formData.append('name', data.name);
          formData.append('email', data.email);
          if (data.phone) formData.append('phone', data.phone);
          if (data.photo) formData.append('photo', data.photo);

          const response = await api.put('/user/profile', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          set({
            user: response.data.user || response.data,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      changePassword: async (data) => {
        set({ isLoading: true });
        try {
          await api.put('/user/password', data);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      uploadPhoto: async (file) => {
        set({ isLoading: true });
        try {
          const formData = new FormData();
          formData.append('photo', file);

          const response = await api.put('/user/profile', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, photo_url: response.data.photo_url },
              isLoading: false
            });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      forgotPassword: async (email) => {
        set({ isLoading: true });
        try {
          await api.post('/forgot-password', { email });
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      resetPassword: async (data) => {
        set({ isLoading: true });
        try {
          await api.post('/reset-password', data);
          set({ isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      clearAuth: () => {
        localStorage.removeItem('auth_token');
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);

export default useAuthStore;
