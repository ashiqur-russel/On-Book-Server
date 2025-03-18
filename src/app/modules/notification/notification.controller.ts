import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const sendRefundNotification = catchAsync(
  async (req: Request, res: Response) => {
    const io = req.app.get('io');
    const { userId, message } = req.body;

    // Emit the notification event to the user's room
    io.to(userId).emit('notification', message);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order cancelled successfully',
      data: {},
    });
  },
);

export const notificationControllers = {
  sendRefundNotification,
};
