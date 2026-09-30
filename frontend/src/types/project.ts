export type ProjectStatus = 'Live' | 'In Development' | 'Completed';

export interface Project {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  imagePublicId?: string;
  liveUrl: string;
  status: ProjectStatus;
  category: string;
  technologies: string[];
  features: string[];
  featured: boolean;
  order: number;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProjectInput = Omit<Project, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectInput = Partial<CreateProjectInput>;
