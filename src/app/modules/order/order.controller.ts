import { Request, Response } from 'express';
import orderService from './order.service';

export class OrderController {
  // Create a new order
  async createOrder(req: Request, res: Response) {
    try {
      const order = await orderService.createOrder(req.body);

      res.status(201).json({
        message: 'Order created successfully',
        status: true,
        data: order,
      });
    } catch (error) {
      const err = error as Error;
      res.status(400).json({
        message: err.message,
        status: false,
        error: err,
      });
    }
  }

  // Get total revenue from orders
  async getTotalRevenue(req: Request, res: Response) {
    try {
      const totalRevenue = await orderService.calculateRevenue();

      res.status(201).json({
        message: 'Revenue calculated successfully',
        status: true,
        data: {
          totalRevenue,
        },
      });
    } catch (error) {
      res.status(400).json({
        message: 'Failed to calculate revenue',
        status: false,
        error,
      });
    }
  }
}

const orderController = new OrderController();
export default orderController;
