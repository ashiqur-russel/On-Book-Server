import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';
import { orderControllers } from './order.controller';
import AuthGuard from '../../middlewares/authGuard';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/',
  AuthGuard(USER_ROLE.user),
  validateRequest(OrderValidation.createOrderValidationSchema),
  orderControllers.createOrder,
);
router.get(
  '/revenue',
  AuthGuard(USER_ROLE.admin),
  orderControllers.getTotalRevenue,
);

export const OrderRouters = router;
