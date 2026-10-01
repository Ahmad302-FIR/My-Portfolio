import { api } from './api';
import type { PortfolioPayload, SkillItem, ExperienceItem } from '../types/portfolio';

export const portfolioService = {
  /**
   * GET /api/portfolio
   * Optimized single endpoint returning settings, active skills, and active experiences.
   */
  async getPortfolio(): Promise<PortfolioPayload> {
    const res = await api.get('/portfolio');
    return res.data.data;
  },

  /**
   * GET /api/skills
   */
  async getSkills(): Promise<SkillItem[]> {
    const res = await api.get('/skills');
    return res.data.data || [];
  },

  /**
   * GET /api/experience
   */
  async getExperiences(): Promise<ExperienceItem[]> {
    const res = await api.get('/experience');
    return res.data.data || [];
  },
};
