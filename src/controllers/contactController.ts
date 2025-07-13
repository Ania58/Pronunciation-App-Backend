import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendContactMessage = async (req: Request, res: Response): Promise<void> => {
  const { name, email, subject, message } = req.body;

  if (!name || !subject || !message) {
     res.status(400).json({ message: 'All fields are required.' });
     return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"SayRight Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `[SayRight] ${subject}`,
      text: `From: ${name}\n\nMessage:\n${message}`,
      replyTo: email,
    });

    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
};
