import { api } from './api';
import type { ExperienceItem } from '../types/portfolio';

export const experienceService = {
  /**
   * GET /api/experience/admin
   */
  async getAdminExperiences(): Promise<ExperienceItem[]> {
    const res = await api.get('/experience/admin');
    return res.data.data || [];
  },

  /**
   * POST /api/experience/admin
   */
  async createExperience(data: Partial<ExperienceItem>): Promise<ExperienceItem> {
    const res = await api.post('/experience/admin', data);
    return res.data.data;
  },

  /**
   * PUT /api/experience/admin/:id
   */
  async updateExperience(id: string, data: Partial<ExperienceItem>): Promise<ExperienceItem> {
    const res = await api.put(`/experience/admin/${id}`, data);
    return res.data.data;
  },

  /**
   * DELETE /api/experience/admin/:id
   */
  async deleteExperience(id: string): Promise<boolean> {
    await api.delete(`/experience/admin/${id}`);
    return true;
  },

  /**
   * PUT /api/experience/admin/reorder
   */
  async reorderExperiences(experiences: { id: string; order: number }[]): Promise<boolean> {
    await api.put('/experience/admin/reorder', { experiences });
    return true;
  },
};
