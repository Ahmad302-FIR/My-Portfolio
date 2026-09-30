import { api } from './api';

export interface ActivityLogItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete';
}

function mapActivityType(type: string): 'create' | 'update' | 'delete' {
  if (type.includes('create')) return 'create';
  if (type.includes('delete')) return 'delete';
  return 'update';
}

export const activityService = {
  /**
   * Fetch real activities from backend: GET /api/admin/activity
   */
  async fetchActivities(): Promise<ActivityLogItem[]> {
    try {
      const res = await api.get('/admin/activity');
      const data = res.data.data || [];
      return data.map((item: any) => ({
        id: item._id || item.id,
        title: item.type.replace(/_/g, ' ').toUpperCase(),
        description: item.description,
        timestamp: item.createdAt || new Date().toISOString(),
        type: mapActivityType(item.type),
      }));
    } catch {
      return this.getActivities();
    }
  },

  /**
   * Synchronous fallback for local state
   */
  getActivities(): ActivityLogItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('portfolio_activity_log');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        }
      }
    } catch (err) {
      console.warn('Failed to parse activity log:', err);
    }
    return [];
  },

  logAction(title: string, description: string, type: 'create' | 'update' | 'delete'): void {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getActivities();
      const newItem: ActivityLogItem = {
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title,
        description,
        timestamp: new Date().toISOString(),
        type,
      };
      const updated = [newItem, ...current].slice(0, 20);
      localStorage.setItem('portfolio_activity_log', JSON.stringify(updated));
    } catch (err) {
      console.warn('Failed to log activity:', err);
    }
  },
};
