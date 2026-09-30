export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Portfolio Admin' | 'Owner';
  avatarUrl?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AdminUser | null;
  token?: string;
}
