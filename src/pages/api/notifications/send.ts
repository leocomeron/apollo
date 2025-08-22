import { EmailService } from '@/services/email';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import authOptions from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { email, subject, message, actionUrl, actionText } = req.body;

    if (!email || !subject || !message) {
      return res.status(400).json({
        message: 'Missing required fields: email, subject, message',
      });
    }

    await EmailService.sendNotificationEmail({
      email,
      subject,
      message,
      actionUrl,
      actionText,
    });

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ message: 'Failed to send notification' });
  }
}
