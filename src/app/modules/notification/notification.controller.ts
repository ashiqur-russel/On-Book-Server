import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationServices } from './notification.service';

const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const result = await NotificationServices.getNotifications(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications fetched successfully',
    data: result,
  });
});

const sendRefundNotification = catchAsync(
  async (req: Request, res: Response) => {
    const io = req.app.get('io');
    const { userId, message } = req.body;

    await NotificationServices.createNotification(userId, message);

    io.to(userId).emit('notification', message);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Refund notification sent successfully',
      data: {},
    });
  },
);

const markNotificationRead = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user;
  const notificationId = req.params.id;

  const updatedNotification = await NotificationServices.markAsRead(
    userId,
    notificationId,
  );

  if (!updatedNotification) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Notification not found or not owned by user',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification marked as read',
    data: updatedNotification,
  });
});

export const notificationControllers = {
  getNotifications,
  sendRefundNotification,
  markNotificationRead,
};
