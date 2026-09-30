import { api } from './api';
import type { ContactMessage } from '../types/message';

function normalizeMessage(m: any): ContactMessage {
  return {
    _id: m._id || m.id,
    name: m.name,
    email: m.email,
    whatsappNumber: m.whatsappNumber || '',
    subject: m.subject,
    message: m.message,
    createdAt: m.createdAt,
    isRead: Boolean(m.isRead !== undefined ? m.isRead : m.read),
  };
}

export const messageService = {
  /**
   * GET /api/messages
   * Returns all messages from MongoDB sorted by newest first.
   */
  async getMessages(): Promise<ContactMessage[]> {
    const res = await api.get('/messages');
    const messages = res.data.data || [];
    return (messages as any[]).map(normalizeMessage);
  },

  /**
   * PATCH /api/messages/:id/read
   * Mark message read or unread.
   */
  async markAsRead(id: string, isRead = true): Promise<ContactMessage> {
    const res = await api.patch(`/messages/${id}/read`, { read: isRead });
    return normalizeMessage(res.data.data);
  },

  /**
   * DELETE /api/messages/:id
   */
  async deleteMessage(id: string): Promise<boolean> {
    await api.delete(`/messages/${id}`);
    return true;
  },

  /**
   * POST /api/messages
   * Sends new message from public contact form to backend and triggers admin notification.
   */
  async createMessage(
    data: Omit<ContactMessage, '_id' | 'createdAt' | 'isRead'> & { website?: string }
  ): Promise<ContactMessage> {
    const res = await api.post('/messages', data);
    return normalizeMessage(res.data.data || data);
  },
};
