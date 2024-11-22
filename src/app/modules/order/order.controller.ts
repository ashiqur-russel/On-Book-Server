import { Request, Response } from 'express';
import orderService from './order.service';

export class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const order = await orderService.createOrder(req.body);

      res.status(201).json({
        message: 'Order created successfully',
        status: true,
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
        status: false,
      });
    }
  }

  async calculateRevenue(req: Request, res: Response) {
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
        message: error.message,
        status: false,
      });
    }
  }
}

const orderController = new OrderController();
export default orderController;
