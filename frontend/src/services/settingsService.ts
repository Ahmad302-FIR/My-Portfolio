import { api } from './api';
import type { PortfolioSettingsData } from '../types/portfolio';

export interface PortfolioSettingsPayload {
  name: string;
  email: string;
  phone?: string;
  location: string;
  linkedin: string;
  github: string;
  whatsappUrl: string;
  availability: string;
  heroTitle: string;
  heroSubtitle: string;
  shortBio: string;
  resumeUrl?: string;
}

export const formatResumeUrl = (url?: string): string => {
  if (!url) return '/Muhammad-Ahmed-Resume.pdf';
  if (url.includes('res.cloudinary.com') && url.includes('/raw/upload/')) {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${apiBase.replace(/\/api\/?$/, '')}/api/resume`;
  }
  if (url.startsWith('/api')) {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${apiBase.replace(/\/api\/?$/, '')}${url}`;
  }
  return url;
};

export const settingsService = {
  /**
   * Fetch portfolio settings: GET /api/settings
   */
  async getPortfolioSettings(): Promise<PortfolioSettingsData> {
    const res = await api.get('/settings');
    const s = res.data.data || {};
    return {
      ...s,
      resumeUrl: formatResumeUrl(s.resumeUrl),
    };
  },

  /**
   * Save / update portfolio settings: PUT /api/settings
   */
  async updatePortfolioSettings(data: Partial<PortfolioSettingsData>): Promise<PortfolioSettingsData> {
    const res = await api.put('/settings', data);
    return res.data.data;
  },

  /**
   * Upload profile image to Cloudinary: POST /api/uploads/profile-image
   */
  async uploadProfileImage(file: File): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await api.post('/uploads/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data.data;
  },

  /**
   * Upload / replace resume file: POST /api/admin/resume (multipart/form-data)
   */
  async updateResume(file: File): Promise<{ success: boolean; filename: string; resumeUrl: string }> {
    const formData = new FormData();
    formData.append('resume', file);

    const res = await api.post('/admin/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      filename: file.name,
      resumeUrl: formatResumeUrl(res.data.data?.resumeUrl),
    };
  },

  /**
   * Change admin password: PATCH /api/auth/change-password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    await api.patch('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return true;
  },
};
