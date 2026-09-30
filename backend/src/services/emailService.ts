import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

export interface SendInquiryNotificationParams {
  name: string;
  email: string;
  whatsappNumber?: string;
  subject: string;
  message: string;
  date: Date;
}

export const getEmailTransporter = () => {
  if (!ENV.SMTP_HOST || !ENV.SMTP_USER || !ENV.SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465,
    auth: {
      user: ENV.SMTP_USER,
      pass: ENV.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const verifySMTPConnection = async (): Promise<boolean> => {
  const transporter = getEmailTransporter();
  if (!transporter) return false;
  try {
    await transporter.verify();
    return true;
  } catch (error: any) {
    console.warn('[SMTP Notice]: Connection verification failed:', error.message);
    return false;
  }
};

export const sendInquiryNotification = async (params: SendInquiryNotificationParams): Promise<boolean> => {
  const transporter = getEmailTransporter();
  if (!transporter) {
    console.log(
      `[Email] SMTP not configured. Skipped sending email notification for inquiry from "${params.name}" (${params.email}).`
    );
    return false;
  }

  try {
    const rawPhone = (params.whatsappNumber || '').trim();
    let cleanedPhone = rawPhone.replace(/[\s\-()+]/g, '');
    if (/^03\d{9}$/.test(cleanedPhone)) {
      cleanedPhone = '92' + cleanedPhone.slice(1);
    }
    const waLink = cleanedPhone ? `https://wa.me/${cleanedPhone}` : null;
    const phoneDisplay = rawPhone
      ? waLink
        ? `<a href="${waLink}" style="color: #22d3ee; text-decoration: underline;">${escapeHtml(rawPhone)}</a>`
        : escapeHtml(rawPhone)
      : 'Not provided';

    const mailOptions = {
      from: `"Portfolio Contact" <${ENV.FROM_EMAIL || ENV.SMTP_USER}>`,
      to: ENV.ADMIN_EMAIL,
      replyTo: params.email,
      subject: `New Portfolio Inquiry — ${params.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #0d1828; color: #f8fafc;">
          <h2 style="color: #22d3ee; margin-top: 0; border-bottom: 1px solid rgba(148, 163, 184, 0.2); padding-bottom: 12px;">New Contact Form Message</h2>
          <p><strong style="color: #94a3b8;">Sender Name:</strong> ${escapeHtml(params.name)}</p>
          <p><strong style="color: #94a3b8;">Email Address:</strong> <a href="mailto:${params.email}" style="color: #22d3ee;">${escapeHtml(params.email)}</a></p>
          <p><strong style="color: #94a3b8;">WhatsApp Number:</strong> ${phoneDisplay}</p>
          <p><strong style="color: #94a3b8;">Subject:</strong> ${escapeHtml(params.subject)}</p>
          <p><strong style="color: #94a3b8;">Date & Time:</strong> ${params.date.toLocaleString()}</p>
          <div style="margin-top: 20px; padding: 15px; background-color: #101d30; border-radius: 6px; border-left: 4px solid #22d3ee;">
            <p style="margin: 0; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${escapeHtml(params.message)}</p>
          </div>
          <div style="margin-top: 24px; font-size: 12px; color: #64748b; border-top: 1px solid rgba(148, 163, 184, 0.15); padding-top: 12px;">
            Sent from Muhammad Ahmed's Portfolio Contact Form.
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] Inquiry notification successfully sent to ${ENV.ADMIN_EMAIL}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send email notification:', error);
    return false;
  }
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
