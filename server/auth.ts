import { supabase } from '@shared/supabase';

export interface AuthResponse {
  success: boolean;
  user?: any;
  session?: any;
  message?: string;
}

export class AuthService {
  static async register(username: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (!data.user?.email_confirmed_at) {
        return {
          success: true,
          message: 'Registration successful! Please check your email to confirm your account before logging in.',
        };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        message: 'Registration successful!',
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed' };
    }
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          return { success: false, message: 'Please confirm your email address before logging in' };
        }
        return { success: false, message: error.message };
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  }

  static async logout(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'Logout failed' };
    }
  }

  static async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        return null;
      }

      return data.session;
    } catch (error) {
      console.error('Session retrieval error:', error);
      return null;
    }
  }

  static async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('User retrieval error:', error);
        return null;
      }

      return data.user;
    } catch (error) {
      console.error('User retrieval error:', error);
      return null;
    }
  }
}