import { api } from './api';
import type { SkillItem } from '../types/portfolio';

export const skillService = {
  /**
   * GET /api/skills/admin
   */
  async getAdminSkills(): Promise<SkillItem[]> {
    const res = await api.get('/skills/admin');
    return res.data.data || [];
  },

  /**
   * POST /api/skills/admin
   */
  async createSkill(data: Partial<SkillItem>): Promise<SkillItem> {
    const res = await api.post('/skills/admin', data);
    return res.data.data;
  },

  /**
   * PUT /api/skills/admin/:id
   */
  async updateSkill(id: string, data: Partial<SkillItem>): Promise<SkillItem> {
    const res = await api.put(`/skills/admin/${id}`, data);
    return res.data.data;
  },

  /**
   * DELETE /api/skills/admin/:id
   */
  async deleteSkill(id: string): Promise<boolean> {
    await api.delete(`/skills/admin/${id}`);
    return true;
  },

  /**
   * PUT /api/skills/admin/reorder
   */
  async reorderSkills(skills: { id: string; order: number }[]): Promise<boolean> {
    await api.put('/skills/admin/reorder', { skills });
    return true;
  },
};
