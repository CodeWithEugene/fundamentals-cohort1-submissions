import { Request, Response } from 'express';

export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { type, recipient, message, payment_id } = req.body;
    
    const notification = {
      id: `notif_${Math.random().toString(36).substr(2, 20)}`,
      type: type || 'payment_update',
      recipient: recipient,
      message: message,
      payment_id: payment_id,
      status: 'sent',
      sent_at: new Date().toISOString(),
      channel: 'email'
    };

    res.json({
      success: true,
      data: notification,
      message: 'Notification sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to send notification',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = [
      {
        id: 'notif_abc123def456ghi789',
        type: 'payment_succeeded',
        recipient: 'customer@example.com',
        message: 'Your payment has been processed successfully',
        payment_id: 'pi_000000000000000000000001',
        status: 'sent',
        sent_at: new Date().toISOString(),
        channel: 'email'
      }
    ];

    res.json({
      success: true,
      data: notifications,
      meta: {
        total: notifications.length,
        version: 'v2'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications'
    });
  }
};