import { Router } from 'express';
import { ProductRouters } from '../modules/product/product.route';
import { OrderRouters } from '../modules/order/order.route';
import { UserRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { PaymentRoutes } from '../modules/payment/payment.route';
import { NotificationRouters } from '../modules/notification/notification.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/products',
    route: ProductRouters,
  },
  {
    path: '/orders',
    route: OrderRouters,
  },

  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: '/notification',
    route: NotificationRouters,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
