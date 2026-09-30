import { api } from './api';

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

export const settingsService = {
  /**
   * Fetch portfolio settings: GET /api/settings
   */
  async getPortfolioSettings(): Promise<PortfolioSettingsPayload & { resumeUrl?: string }> {
    const res = await api.get('/settings');
    const s = res.data.data || {};
    return {
      name: s.name || 'Muhammad Ahmed',
      email: s.email || 'info.ahmadkhan.com@gmail.com',
      phone: s.phone || '+92 329 5664981',
      location: s.location || 'Pakistan (Remote / Worldwide)',
      linkedin: s.linkedin || 'https://www.linkedin.com/in/muhammad-ahmed-6867a5370',
      github: s.github || 'https://github.com/Ahmad302-FIR',
      whatsappUrl: s.whatsapp || 'https://wa.me/923295664981',
      availability: s.availability || 'Available for freelance & full-time roles',
      heroTitle: s.heroHeadline || 'Muhammad Ahmed',
      heroSubtitle: s.heroRole || 'Full Stack MERN Developer',
      shortBio:
        s.shortBio ||
        'I build complete web products — from responsive frontend interfaces to secure backend APIs, databases, authentication, and production deployment.',
      resumeUrl: s.resumeUrl || '/Muhammad-Ahmed-Resume.pdf',
    };
  },

  /**
   * Save / update portfolio text and profile settings: PUT /api/settings
   */
  async updatePortfolioSettings(data: PortfolioSettingsPayload): Promise<boolean> {
    const payload = {
      name: data.name,
      email: data.email,
      location: data.location,
      linkedin: data.linkedin,
      github: data.github,
      whatsapp: data.whatsappUrl,
      availability: data.availability,
      heroHeadline: data.heroTitle,
      heroRole: data.heroSubtitle,
      shortBio: data.shortBio,
    };

    await api.put('/settings', payload);
    return true;
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
      resumeUrl: res.data.data?.resumeUrl || '',
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
