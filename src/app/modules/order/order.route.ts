import { Router } from 'express';
import orderController from './order.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';

const router = Router();

router.post(
  '/',
  validateRequest(OrderValidation.createOrderValidationSchema),
  orderController.createOrder,
);
router.get('/revenue', orderController.getTotalRevenue);

export const OrderRouters = router;
