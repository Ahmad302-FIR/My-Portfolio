import { api } from './api';
import type { Project, CreateProjectInput, UpdateProjectInput } from '../types/project';

function normalizeProject(p: any): Project {
  return {
    ...p,
    id: p._id || p.id || p.slug,
    _id: p._id || p.id,
  };
}

export const projectService = {
  /**
   * GET /api/projects
   * Retrieves all projects sorted by display order from backend.
   */
  async getProjects(): Promise<Project[]> {
    const res = await api.get('/projects');
    const projects = res.data.data || [];
    return (projects as any[]).map(normalizeProject);
  },

  /**
   * GET /api/projects/:slug
   * Retrieves a single project by unique slug.
   */
  async getProjectBySlug(slug: string): Promise<Project | null> {
    const res = await api.get(`/projects/${slug}`);
    if (!res.data.data) return null;
    return normalizeProject(res.data.data);
  },

  /**
   * POST /api/projects
   * Creates a new project in backend.
   */
  async createProject(input: CreateProjectInput): Promise<Project> {
    const res = await api.post('/projects', input);
    return normalizeProject(res.data.data);
  },

  /**
   * PUT /api/projects/:id
   * Updates an existing project in backend.
   */
  async updateProject(id: string, updates: UpdateProjectInput): Promise<Project> {
    const res = await api.put(`/projects/${id}`, updates);
    return normalizeProject(res.data.data);
  },

  /**
   * DELETE /api/projects/:id
   * Deletes a project from backend.
   */
  async deleteProject(id: string): Promise<boolean> {
    await api.delete(`/projects/${id}`);
    return true;
  },

  /**
   * POST /api/uploads/project-image
   * Uploads screenshot to Cloudinary / storage.
   */
  async uploadScreenshot(file: File): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await api.post('/uploads/project-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data.data;
  },
};
