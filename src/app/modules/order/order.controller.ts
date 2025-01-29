import { Request, Response } from 'express';
import orderService from './order.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

// Create a new order
const createOrder = catchAsync(async (req: Request, res: Response) => {
  const order = await orderService.createOrder(req.body);

  res.status(201).json({
    message: 'Order created successfully',
    status: true,
    data: order,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully',
    data: order,
  });
});

// Get total revenue from orders
const getTotalRevenue = catchAsync(async (req: Request, res: Response) => {
  const totalRevenue = await orderService.calculateRevenue();

  res.status(201).json({
    message: 'Revenue calculated successfully',
    status: true,
    data: {
      totalRevenue,
    },
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order created successfully',
    data: {
      totalRevenue,
    },
  });
});

export const orderControllers = { createOrder, getTotalRevenue };
