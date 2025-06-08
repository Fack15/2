import { create } from 'zustand';
import { supabase } from './supabase-client';
import type { User, Session } from '@supabase/supabase-js';

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

export const useAuth = create<AuthState>()((set, get) => ({
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
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }
      
      set({
        user: data.user,
        session: data.session,
        isAuthenticated: true,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  },
  
  register: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('Registration error:', error);
        return { success: false, error: error.message };
      }
      
      if (data.user && !data.user.email_confirmed_at) {
        return {
          success: true,
          error: 'Registration successful! Please check your email to confirm your account.',
        };
      }
      
      set({
        user: data.user,
        session: data.session,
        isAuthenticated: !!data.session,
      });
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  },
  
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        session: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  initialize: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      
      set({
        user: data.session?.user || null,
        session: data.session,
        isAuthenticated: !!data.session,
        isLoading: false,
      });
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange((event, session) => {
        set({
          user: session?.user || null,
          session,
          isAuthenticated: !!session,
          isLoading: false,
        });
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  },
}));