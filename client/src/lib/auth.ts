import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from './supabase-client';
import type { User, Session } from './supabase-client';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  (set, get) => ({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    
    login: async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          return { success: false, error: error.message };
        }
        
        if (data.user && data.session) {
          set({ 
            user: data.user, 
            session: data.session, 
            isAuthenticated: true,
            isLoading: false
          });
          return { success: true };
        }
        
        return { success: false, error: 'Login failed' };
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Network error' };
      }
    },

    register: async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`
          }
        });
        
        if (error) {
          return { success: false, error: error.message };
        }
        
        if (data.user) {
          return { success: true };
        }
        
        return { success: false, error: 'Registration failed' };
      } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: 'Network error' };
      }
    },

    logout: async () => {
      await supabase.auth.signOut();
      set({ user: null, session: null, isAuthenticated: false });
    },

    initialize: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          set({ 
            user: session.user, 
            session, 
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          set({ isLoading: false });
        }

        // Listen for auth state changes
        supabase.auth.onAuthStateChange((event: string, session: any) => {
          if (session) {
            set({ 
              user: session.user, 
              session, 
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            set({ 
              user: null, 
              session: null, 
              isAuthenticated: false,
              isLoading: false
            });
          }
        });
      } catch (error) {
        console.error('Auth initialization error:', error);
        set({ isLoading: false });
      }
    },
  })
);