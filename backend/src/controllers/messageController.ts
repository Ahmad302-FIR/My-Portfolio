import { Request, Response } from 'express';
import { z } from 'zod';
import { Message } from '../models/Message';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { sendInquiryNotification } from '../services/emailService';

export const createMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80, 'Name cannot exceed 80 characters').trim(),
  email: z.string().email('Please enter a valid email address').trim().toLowerCase(),
  whatsappNumber: z
    .string({ required_error: 'WhatsApp number is required' })
    .trim()
    .min(7, 'WhatsApp number must be at least 7 characters')
    .max(25, 'WhatsApp number cannot exceed 25 characters')
    .regex(/^[+]?[0-9\s\-()]{7,25}$/, 'Please enter a valid WhatsApp phone number (e.g. +92 329 5664981)'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(150, 'Subject cannot exceed 150 characters').trim(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(3000, 'Message cannot exceed 3000 characters').trim(),
  // Honeypot spam field
  website: z.string().optional(),
});

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, whatsappNumber, subject, message, website } = req.body;

  // Lightweight honeypot check: If the hidden 'website' field was filled, reject or simulate success
  if (website && website.trim().length > 0) {
    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
    });
  }

  const newMessage = await Message.create({
    name,
    email,
    whatsappNumber: (whatsappNumber || '').trim(),
    subject,
    message,
    read: false,
  });

  // Attempt to send email notification to admin asynchronously
  sendInquiryNotification({
    name,
    email,
    whatsappNumber: newMessage.whatsappNumber || '',
    subject,
    message,
    date: newMessage.createdAt,
  }).catch((err) => {
    console.error('Inquiry email notification error:', err);
  });

  res.status(201).json({
    success: true,
    message: 'Thank you! Your message has been sent successfully.',
    data: {
      id: newMessage._id,
      name: newMessage.name,
      email: newMessage.email,
      whatsappNumber: newMessage.whatsappNumber,
      subject: newMessage.subject,
      createdAt: newMessage.createdAt,
    },
  });
});

export const getMessages = asyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query;
  let query = {};
  if (search && typeof search === 'string' && search.trim()) {
    const q = search.trim();
    const orConditions: any[] = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { whatsappNumber: { $regex: q, $options: 'i' } },
      { subject: { $regex: q, $options: 'i' } },
      { message: { $regex: q, $options: 'i' } },
    ];

    // If query contains digits, allow searching irrespective of formatting spaces/dashes
    const digitsOnly = q.replace(/[^0-9]/g, '');
    if (digitsOnly.length >= 3) {
      const flexiblePhonePattern = digitsOnly.split('').join('[\\s\\-()]*');
      orConditions.push({ whatsappNumber: { $regex: flexiblePhonePattern, $options: 'i' } });
    }

    query = { $or: orConditions };
  }

  const messages = await Message.find(query).sort({ createdAt: -1 }).lean();

  res.status(200).json({
    success: true,
    data: messages,
  });
});

export const getMessageById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await Message.findById(id);

  if (!message) {
    throw new ApiError(404, 'Message not found');
  }

  if (!message.read) {
    message.read = true;
    await message.save();
  }

  res.status(200).json({
    success: true,
    data: message,
  });
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { read } = req.body;

  const message = await Message.findById(id);
  if (!message) {
    throw new ApiError(404, 'Message not found');
  }

  message.read = typeof read === 'boolean' ? read : true;
  await message.save();

  res.status(200).json({
    success: true,
    data: message,
  });
});

export const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await Message.findByIdAndDelete(id);

  if (!message) {
    throw new ApiError(404, 'Message not found');
  }

  res.status(200).json({
    success: true,
    message: 'Message deleted successfully',
  });
});
