import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { orderService } from './order.service';

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

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const updatedOrder = await orderService.updateOrder(orderId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order updated successfully',
    data: updatedOrder,
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

export const orderControllers = { createOrder, updateOrder, getTotalRevenue };
