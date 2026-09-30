import { api } from './api';
import type { AdminUser, AuthState } from '../types/auth';

const AUTH_STORAGE_KEY = 'portfolio_admin_auth';
const TOKEN_STORAGE_KEY = 'portfolio_admin_token';
const REMEMBER_KEY = 'portfolio_admin_remember';

export const authService = {
  /**
   * Real backend login: POST /api/auth/login
   */
  async login(email: string, password: string, rememberMe = false): Promise<AdminUser> {
    if (!email || !password) {
      throw new Error('Please enter both email and password.');
    }

    const res = await api.post('/auth/login', { email, password });
    const { admin, token } = res.data.data;

    const user: AdminUser = {
      id: admin.id || admin._id,
      name: admin.name,
      email: admin.email,
      role: 'Portfolio Admin',
      avatarUrl: '/profile.jpg',
    };

    const authState: AuthState = {
      isAuthenticated: true,
      user,
      token,
    };

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
    storage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(REMEMBER_KEY, rememberMe ? 'true' : 'false');

    return user;
  },

  /**
   * Log out and purge session tokens: POST /api/auth/logout
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  },

  /**
   * Check if current session has active admin authorization.
   */
  isAuthenticated(): boolean {
    const raw =
      localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return false;
    try {
      const state: AuthState = JSON.parse(raw);
      return Boolean(state?.isAuthenticated && state?.user);
    } catch {
      return false;
    }
  },

  /**
   * Retrieve active admin user profile from local storage.
   */
  getCurrentUser(): AdminUser | null {
    const raw =
      localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    try {
      const state: AuthState = JSON.parse(raw);
      return state.user || null;
    } catch {
      return null;
    }
  },

  /**
   * Fetch current authenticated admin user from backend: GET /api/auth/me
   */
  async getMe(): Promise<AdminUser | null> {
    try {
      const res = await api.get('/auth/me');
      const admin = res.data.data.admin;
      const user: AdminUser = {
        id: admin.id || admin._id,
        name: admin.name,
        email: admin.email,
        role: 'Portfolio Admin',
        avatarUrl: '/profile.jpg',
      };
      return user;
    } catch {
      return null;
    }
  },
};
