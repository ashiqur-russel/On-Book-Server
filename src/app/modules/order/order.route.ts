import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrderValidation } from './order.validation';
import { orderControllers } from './order.controller';
import AuthGuard from '../../middlewares/authGuard';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
router.get(
  '/',
  AuthGuard(USER_ROLE.admin, USER_ROLE.user),
  orderControllers.getAllOrders,
);

router.post(
  '/',
  AuthGuard(USER_ROLE.user),
  validateRequest(OrderValidation.createOrderValidationSchema),
  orderControllers.createOrder,
);

router.patch(
  '/:orderId/cancel',
  AuthGuard(USER_ROLE.user),
  validateRequest(OrderValidation.cancelOrderValidationSchema),
  orderControllers.cancelOrder,
);

router.patch(
  '/:orderId',
  AuthGuard(USER_ROLE.user),
  validateRequest(OrderValidation.updateOrderValidationSchema),
  orderControllers.updateOrder,
);

router.get(
  '/revenue',
  AuthGuard(USER_ROLE.admin),
  orderControllers.getTotalRevenue,
);

router.get(
  '/my-orders',
  AuthGuard(USER_ROLE.user),
  orderControllers.getMyOrders,
);

export const OrderRouters = router;
