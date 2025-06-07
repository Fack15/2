import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { storage, db } from './storage';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import type { User } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

export interface AuthResponse {
  success: boolean;
  user?: Omit<User, 'password'>;
  token?: string;
  message?: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  }

  static verifyToken(token: string): { userId: number } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: number };
    } catch {
      return null;
    }
  }

  static generateEmailConfirmationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static async sendConfirmationEmail(email: string, token: string, username: string): Promise<void> {
    if (!EMAIL_USER || !EMAIL_PASS) {
      console.warn('Email credentials not configured, skipping email confirmation');
      return;
    }

    const confirmationUrl = `${BASE_URL}/api/auth/confirm-email?token=${token}`;
    
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Confirm Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome ${username}!</h2>
          <p>Thank you for registering. Please click the button below to confirm your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Confirm Email Address
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${confirmationUrl}</p>
          <p>This link will expire in 24 hours.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  static async register(username: string, email: string, password: string): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return { success: false, message: 'Email already registered' };
      }

      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return { success: false, message: 'Username already taken' };
      }

      // Hash password and generate confirmation token
      const hashedPassword = await this.hashPassword(password);
      const confirmationToken = this.generateEmailConfirmationToken();
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
      });
      console.log('created user', user, 'confirmation token', confirmationToken, 'token expiry', tokenExpiry, 'email', email, 'username', username, 'password', password, 'hashed password', hashedPassword)

      // Update user with confirmation token
      await storage.updateUser(user.id, {
        isEmailConfirmed: false,
        emailConfirmationToken: confirmationToken,
        emailConfirmationTokenExpiry: tokenExpiry,
      });

      // Send confirmation email
      await this.sendConfirmationEmail(email, confirmationToken, username);

      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        message: 'Registration successful! Please check your email to confirm your account.',
        user: userWithoutPassword,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed' };
    }
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return { success: false, message: 'Invalid email or password' };
      }

      const isValidPassword = await this.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return { success: false, message: 'Invalid email or password' };
      }

      if (!user.isEmailConfirmed) {
        return { success: false, message: 'Please confirm your email address before logging in' };
      }

      const token = this.generateToken(user.id);
      const { password: _, ...userWithoutPassword } = user;
      return {
        success: true,
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  }

  static async confirmEmail(token: string): Promise<AuthResponse> {
    try {
      // Find user by confirmation token
      const usersList = await db.select().from(users).where(
        eq(users.emailConfirmationToken, token)
      );
      
      if (usersList.length === 0) {
        return { success: false, message: 'Invalid confirmation token' };
      }

      const user = usersList[0];

      // Check if token is expired
      if (user.emailConfirmationTokenExpiry && user.emailConfirmationTokenExpiry < new Date()) {
        return { success: false, message: 'Confirmation token has expired' };
      }

      // Update user to confirmed
      const updatedUser = await storage.updateUser(user.id, {
        isEmailConfirmed: true,
        emailConfirmationToken: null,
        emailConfirmationTokenExpiry: null,
      });

      const userWithoutPassword = updatedUser ? (() => {
        const { password: _, ...rest } = updatedUser;
        return rest;
      })() : undefined;

      return {
        success: true,
        message: 'Email confirmed successfully! You can now log in.',
        user: userWithoutPassword,
      };
    } catch (error) {
      console.error('Email confirmation error:', error);
      return { success: false, message: 'Email confirmation failed' };
    }
  }
}