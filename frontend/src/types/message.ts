export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  whatsappNumber?: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}
